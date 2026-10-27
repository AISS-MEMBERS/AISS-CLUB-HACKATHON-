export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      admin_users: {
        Row: {
          user_id: string;
          created_at: string;
        };
        Insert: {
          user_id: string;
          created_at?: string;
        };
        Update: {
          user_id?: string;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "admin_users_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: true;
            referencedRelation: "users";
            referencedSchema: "auth";
          }
        ];
      };
      events: {
        Row: {
          id: string;
          title: string;
          description: string;
          category: "WORKSHOP" | "TALK" | "BUILD SESSION";
          starts_at: string;
          ends_at: string | null;
          location: string | null;
          lead: string | null;
          image_path: string | null;
          publication_status: "draft" | "published" | "archived";
          is_featured: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description: string;
          category: "WORKSHOP" | "TALK" | "BUILD SESSION";
          starts_at: string;
          ends_at?: string | null;
          location?: string | null;
          lead?: string | null;
          image_path?: string | null;
          publication_status?: "draft" | "published" | "archived";
          is_featured?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string;
          category?: "WORKSHOP" | "TALK" | "BUILD SESSION";
          starts_at?: string;
          ends_at?: string | null;
          location?: string | null;
          lead?: string | null;
          image_path?: string | null;
          publication_status?: "draft" | "published" | "archived";
          is_featured?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      contact_messages: {
        Row: {
          id: string;
          full_name: string;
          university_email: string;
          area_of_interest:
            | "Machine Learning"
            | "Robotics"
            | "Joining the Team"
            | "General Inquiry";
          message: string;
          status: "new" | "read" | "archived";
          created_at: string;
        };
        Insert: {
          id?: string;
          full_name: string;
          university_email: string;
          area_of_interest:
            | "Machine Learning"
            | "Robotics"
            | "Joining the Team"
            | "General Inquiry";
          message: string;
          status?: "new" | "read" | "archived";
          created_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string;
          university_email?: string;
          area_of_interest?:
            | "Machine Learning"
            | "Robotics"
            | "Joining the Team"
            | "General Inquiry";
          message?: string;
          status?: "new" | "read" | "archived";
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}

export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"];
export type TablesInsert<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Insert"];
export type TablesUpdate<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Update"];

export type AdminUserRow = Tables<"admin_users">;
export type EventRow = Tables<"events">;
export type ContactMessageRow = Tables<"contact_messages">;
