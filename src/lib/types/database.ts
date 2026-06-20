/**
 * Supabaseのテーブル構造に対応する型定義。
 * supabase/migrations/0001_init.sql の内容と一致させること。
 *
 * Supabaseプロジェクト作成後、CLIが使える環境であれば
 *   npx supabase gen types typescript --project-id <project-id> > src/lib/types/database.ts
 * を実行して自動生成したファイルに置き換えることを推奨します(手書きとのズレを防げます)。
 */

export type BookingStatus = "pending" | "accepted" | "declined" | "completed";

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          is_creator: boolean;
          display_name: string;
          bio: string | null;
          discord_id: string | null;
          profile_image_url: string | null;
          country: string | null;
          languages: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          is_creator?: boolean;
          display_name: string;
          bio?: string | null;
          discord_id?: string | null;
          profile_image_url?: string | null;
          country?: string | null;
          languages?: string[];
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>;
      };
      games: {
        Row: {
          id: string;
          name: string;
          slug: string;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          is_active?: boolean;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["games"]["Insert"]>;
      };
      categories: {
        Row: {
          id: number;
          slug: string;
          name: string;
        };
        Insert: {
          id?: number;
          slug: string;
          name: string;
        };
        Update: Partial<Database["public"]["Tables"]["categories"]["Insert"]>;
      };
      creator_games: {
        Row: {
          id: string;
          creator_id: string;
          game_id: string;
          category_id: number;
          rank: string | null;
          price: number;
          description: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          creator_id: string;
          game_id: string;
          category_id: number;
          rank?: string | null;
          price: number;
          description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<
          Database["public"]["Tables"]["creator_games"]["Insert"]
        >;
      };
      bookings: {
        Row: {
          id: string;
          user_id: string;
          creator_id: string;
          creator_game_id: string;
          category_id: number;
          price: number;
          message: string | null;
          status: BookingStatus;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          creator_id: string;
          creator_game_id: string;
          category_id: number;
          price: number;
          message?: string | null;
          status?: BookingStatus;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["bookings"]["Insert"]>;
      };
    };
    Views: {
      creator_stats: {
        Row: {
          creator_id: string;
          completed_count: number;
        };
      };
    };
    Enums: {
      booking_status: BookingStatus;
    };
  };
};
