export type Database = {
  public: {
    Tables: {
      church_settings: {
        Row: {
          id: string;
          hero_eyebrow: string;
          hero_title: string;
          hero_description: string;
          service_time: string;
          address: string;
          email: string;
          giving_note: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          hero_eyebrow?: string;
          hero_title?: string;
          hero_description?: string;
          service_time?: string;
          address?: string;
          email?: string;
          giving_note?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          hero_eyebrow?: string;
          hero_title?: string;
          hero_description?: string;
          service_time?: string;
          address?: string;
          email?: string;
          giving_note?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      sermons: {
        Row: {
          id: string;
          title: string;
          speaker: string;
          sermon_date: string;
          summary: string | null;
          media_url: string | null;
          published: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          speaker: string;
          sermon_date: string;
          summary?: string | null;
          media_url?: string | null;
          published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          speaker?: string;
          sermon_date?: string;
          summary?: string | null;
          media_url?: string | null;
          published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      events: {
        Row: {
          id: string;
          title: string;
          event_date: string | null;
          time_label: string;
          location: string;
          description: string | null;
          published: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          event_date?: string | null;
          time_label: string;
          location: string;
          description?: string | null;
          published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          event_date?: string | null;
          time_label?: string;
          location?: string;
          description?: string | null;
          published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      ministries: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          sort_order: number;
          published: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          sort_order?: number;
          published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          sort_order?: number;
          published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      contact_messages: {
        Row: {
          id: string;
          name: string;
          email: string;
          message: string;
          status: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          message: string;
          status?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          message?: string;
          status?: string;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

export type ChurchSettings = Database["public"]["Tables"]["church_settings"]["Row"];
export type Sermon = Database["public"]["Tables"]["sermons"]["Row"];
export type ChurchEvent = Database["public"]["Tables"]["events"]["Row"];
export type Ministry = Database["public"]["Tables"]["ministries"]["Row"];
export type ContactMessage = Database["public"]["Tables"]["contact_messages"]["Row"];
