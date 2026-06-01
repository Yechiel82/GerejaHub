export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      contact_submissions: {
        Row: {
          id: string
          name: string
          email: string
          subject: string
          message: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          subject: string
          message: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          subject?: string
          message?: string
          created_at?: string
        }
      }
      events: {
        Row: {
          id: string
          title: string
          description: string | null
          event_date: string
          location: string | null
          image_url: string | null
          published: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          event_date: string
          location?: string | null
          image_url?: string | null
          published?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          event_date?: string
          location?: string | null
          image_url?: string | null
          published?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      event_rsvps: {
        Row: {
          id: string
          event_id: string
          user_id: string
          status: 'going' | 'maybe' | 'not_going'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          event_id: string
          user_id: string
          status: 'going' | 'maybe' | 'not_going'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          event_id?: string
          user_id?: string
          status?: 'going' | 'maybe' | 'not_going'
          created_at?: string
          updated_at?: string
        }
      }
      ministries: {
        Row: {
          id: string
          name: string
          description: string | null
          meeting_day: string | null
          meeting_time: string | null
          meeting_location: string | null
          sort_order: number
          published: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          meeting_day?: string | null
          meeting_time?: string | null
          meeting_location?: string | null
          sort_order?: number
          published?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          meeting_day?: string | null
          meeting_time?: string | null
          meeting_location?: string | null
          sort_order?: number
          published?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      ministry_members: {
        Row: {
          id: string
          ministry_id: string
          user_id: string
          role: string | null
          joined_at: string
        }
        Insert: {
          id?: string
          ministry_id: string
          user_id: string
          role?: string | null
          joined_at?: string
        }
        Update: {
          id?: string
          ministry_id?: string
          user_id?: string
          role?: string | null
          joined_at?: string
        }
      }
      prayer_requests: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string | null
          is_anonymous: boolean
          status: 'pending' | 'approved' | 'rejected'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          description?: string | null
          is_anonymous?: boolean
          status?: 'pending' | 'approved' | 'rejected'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          description?: string | null
          is_anonymous?: boolean
          status?: 'pending' | 'approved' | 'rejected'
          created_at?: string
          updated_at?: string
        }
      }
      sermons: {
        Row: {
          id: string
          title: string
          speaker: string
          sermon_date: string
          description: string | null
          video_url: string | null
          audio_url: string | null
          thumbnail_url: string | null
          scripture_reference: string | null
          series: string | null
          published: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          speaker: string
          sermon_date: string
          description?: string | null
          video_url?: string | null
          audio_url?: string | null
          thumbnail_url?: string | null
          scripture_reference?: string | null
          series?: string | null
          published?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          speaker?: string
          sermon_date?: string
          description?: string | null
          video_url?: string | null
          audio_url?: string | null
          thumbnail_url?: string | null
          scripture_reference?: string | null
          series?: string | null
          published?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      sermon_bookmarks: {
        Row: {
          id: string
          sermon_id: string
          user_id: string
          created_at: string
        }
        Insert: {
          id?: string
          sermon_id: string
          user_id: string
          created_at?: string
        }
        Update: {
          id?: string
          sermon_id?: string
          user_id?: string
          created_at?: string
        }
      }
      sermon_notes: {
        Row: {
          id: string
          sermon_id: string
          user_id: string
          content: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          sermon_id: string
          user_id: string
          content: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          sermon_id?: string
          user_id?: string
          content?: string
          created_at?: string
          updated_at?: string
        }
      }
      user_profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          phone: string | null
          address: string | null
          date_of_birth: string | null
          role: 'member' | 'admin'
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          phone?: string | null
          address?: string | null
          date_of_birth?: string | null
          role?: 'member' | 'admin'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          phone?: string | null
          address?: string | null
          date_of_birth?: string | null
          role?: 'member' | 'admin'
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

// Made with Bob


// Convenience type exports
export type Profile = Database['public']['Tables']['user_profiles']['Row']
export type Event = Database['public']['Tables']['events']['Row']
export type EventRsvp = Database['public']['Tables']['event_rsvps']['Row']
export type Ministry = Database['public']['Tables']['ministries']['Row']
export type MinistryMember = Database['public']['Tables']['ministry_members']['Row']
export type Sermon = Database['public']['Tables']['sermons']['Row']
export type SermonBookmark = Database['public']['Tables']['sermon_bookmarks']['Row']
export type SermonNote = Database['public']['Tables']['sermon_notes']['Row']
export type PrayerRequest = Database['public']['Tables']['prayer_requests']['Row']
export type ContactSubmission = Database['public']['Tables']['contact_submissions']['Row']
