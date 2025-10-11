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

// Generate unique referral code
export function generateReferralCode(firstName: string, lastName: string): string {
    const name = `${firstName}${lastName}`.toUpperCase().replace(/[^A-Z]/g, '');
    const randomNum = Math.floor(Math.random() * 9999).toString().padStart(4, '0');
    return `${name.substring(0, 6)}${randomNum}`;
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

// Create new RSVP
export async function createRSVP(data: {
    firstName: string;
    lastName: string;
    contact: string;
    grade: string;
    referrer?: string;
    dietary?: string;
    referredByCode?: string;
}) {
    const referralCode = generateReferralCode(data.firstName, data.lastName);

    // Insert new user
    const { data: newUser, error } = await supabase
        .from('users')
        .insert({
            first_name: data.firstName,
            last_name: data.lastName,
            contact: data.contact,
            grade: data.grade,
            referrer_name: data.referrer || null,
            dietary_restrictions: data.dietary || null,
            referral_code: referralCode,
            referred_by_code: data.referredByCode || null,
        })
        .select()
        .single();

    if (error) throw error;

    // If they were referred, increment the referrer's count
    if (data.referredByCode) {
        const { error: updateError } = await supabase.rpc('increment_recruit_count', {
            ref_code: data.referredByCode,
        });

        if (updateError) console.error('Error updating recruit count:', updateError);
    }

    return newUser as User;
}

// Get user by referral code
export async function getUserByReferralCode(code: string) {
    const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('referral_code', code)
        .single();

    if (error) return null;
    return data as User;
}