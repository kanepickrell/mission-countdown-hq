import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface User {
    id: string;
    first_name: string;
    last_name: string;
    contact: string;
    grade: string;
    referrer_name?: string;
    dietary_restrictions?: string;
    referral_code: string;
    referred_by_code?: string;
    recruit_count: number;
    created_at: string;
}

// Generate unique referral code with retry logic
export async function generateUniqueReferralCode(firstName: string, lastName: string): Promise<string> {
    const name = `${firstName}${lastName}`.toUpperCase().replace(/[^A-Z]/g, '');
    const baseName = name.substring(0, 6).padEnd(6, 'X'); // Ensure 6 chars

    let attempts = 0;
    const maxAttempts = 10;

    while (attempts < maxAttempts) {
        const randomNum = Math.floor(Math.random() * 9999).toString().padStart(4, '0');
        const code = `${baseName}${randomNum}`;

        // Check if code exists
        const { data, error } = await supabase
            .from('users')
            .select('referral_code')
            .eq('referral_code', code)
            .maybeSingle();

        if (error && error.code !== 'PGRST116') {
            console.error('Error checking referral code:', error);
            attempts++;
            continue;
        }

        if (!data) {
            return code;
        }

        attempts++;
    }

    // Fallback to timestamp-based code if all attempts fail
    const timestamp = Date.now().toString().slice(-6);
    return `${baseName.substring(0, 4)}${timestamp}`;
}

// Check if contact already exists
export async function checkDuplicateContact(contact: string): Promise<boolean> {
    const { data, error } = await supabase
        .from('users')
        .select('id')
        .eq('contact', contact.toLowerCase().trim())
        .maybeSingle();

    if (error && error.code !== 'PGRST116') {
        console.error('Error checking duplicate:', error);
        return false;
    }

    return !!data;
}

// Get leaderboard
export async function getLeaderboard(limit: number = 10) {
    const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('recruit_count', { ascending: false })
        .order('created_at', { ascending: true })
        .limit(limit);

    if (error) throw error;
    return data as User[];
}

// Get total user count
export async function getTotalUsers() {
    const { count, error } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true });

    if (error) throw error;
    return count || 0;
}

// Create new RSVP with validation
export async function createRSVP(data: {
    firstName: string;
    lastName: string;
    contact: string;
    grade: string;
    referrer: string;
    dietary: string;
    referredByCode?: string;
}) {
    // Normalize contact
    const normalizedContact = data.contact.toLowerCase().trim();

    // Check for duplicate
    const isDuplicate = await checkDuplicateContact(normalizedContact);
    if (isDuplicate) {
        throw new Error('DUPLICATE_CONTACT');
    }

    // Validate grade is not empty
    if (!data.grade || data.grade === 'EMPTY' || data.grade.trim() === '') {
        throw new Error('INVALID_GRADE');
    }

    // Generate unique referral code
    const referralCode = await generateUniqueReferralCode(data.firstName, data.lastName);

    // Prevent self-referral (if somehow they got their own code)
    if (data.referredByCode === referralCode) {
        throw new Error('SELF_REFERRAL');
    }

    // Validate referred_by_code exists if provided
    if (data.referredByCode) {
        const referrer = await getUserByReferralCode(data.referredByCode);
        if (!referrer) {
            console.warn('Invalid referral code:', data.referredByCode);
            // Continue without referral instead of failing
            data.referredByCode = undefined;
        }
    }

    // Insert new user
    const { data: newUser, error } = await supabase
        .from('users')
        .insert({
            first_name: data.firstName.trim(),
            last_name: data.lastName.trim(),
            contact: normalizedContact,
            grade: data.grade.trim(),
            referrer_name: data.referrer?.trim() || null,
            dietary_restrictions: data.dietary?.trim() || null,
            referral_code: referralCode,
            referred_by_code: data.referredByCode || null,
        })
        .select()
        .single();

    if (error) {
        console.error('Error creating RSVP:', error);
        throw error;
    }

    // If they were referred, increment the referrer's count
    if (data.referredByCode) {
        const { error: updateError } = await supabase.rpc('increment_recruit_count', {
            ref_code: data.referredByCode,
        });

        if (updateError) {
            console.error('Error updating recruit count:', updateError);
            // Don't throw - the user is still created
        }
    }

    return newUser as User;
}

// Get user by referral code
export async function getUserByReferralCode(code: string) {
    const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('referral_code', code.toUpperCase().trim())
        .maybeSingle();

    if (error && error.code !== 'PGRST116') {
        console.error('Error fetching user:', error);
        return null;
    }

    return data as User | null;
}