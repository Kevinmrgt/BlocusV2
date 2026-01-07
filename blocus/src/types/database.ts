export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          username: string | null;
          bio: string | null;
          avatar_url: string | null;
          total_points: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          username?: string | null;
          bio?: string | null;
          avatar_url?: string | null;
          total_points?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          username?: string | null;
          bio?: string | null;
          avatar_url?: string | null;
          total_points?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      gyms: {
        Row: {
          id: string;
          name: string;
          address: string;
          latitude: number;
          longitude: number;
          description: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          address: string;
          latitude: number;
          longitude: number;
          description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          address?: string;
          latitude?: number;
          longitude?: number;
          description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      gym_admins: {
        Row: {
          id: string;
          user_id: string;
          gym_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          gym_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          gym_id?: string;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'gym_admins_user_id_fkey';
            columns: ['user_id'];
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'gym_admins_gym_id_fkey';
            columns: ['gym_id'];
            referencedRelation: 'gyms';
            referencedColumns: ['id'];
          },
        ];
      };
      gym_photos: {
        Row: {
          id: string;
          gym_id: string;
          url: string;
          order_index: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          gym_id: string;
          url: string;
          order_index?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          gym_id?: string;
          url?: string;
          order_index?: number;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'gym_photos_gym_id_fkey';
            columns: ['gym_id'];
            referencedRelation: 'gyms';
            referencedColumns: ['id'];
          },
        ];
      };
      walls: {
        Row: {
          id: string;
          gym_id: string;
          name: string;
          description: string | null;
          order_index: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          gym_id: string;
          name: string;
          description?: string | null;
          order_index?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          gym_id?: string;
          name?: string;
          description?: string | null;
          order_index?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'walls_gym_id_fkey';
            columns: ['gym_id'];
            referencedRelation: 'gyms';
            referencedColumns: ['id'];
          },
        ];
      };
      wall_photos: {
        Row: {
          id: string;
          wall_id: string;
          url: string;
          order_index: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          wall_id: string;
          url: string;
          order_index?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          wall_id?: string;
          url?: string;
          order_index?: number;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'wall_photos_wall_id_fkey';
            columns: ['wall_id'];
            referencedRelation: 'walls';
            referencedColumns: ['id'];
          },
        ];
      };
      boulders: {
        Row: {
          id: string;
          wall_id: string;
          title: string;
          description: string | null;
          difficulty: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          wall_id: string;
          title: string;
          description?: string | null;
          difficulty: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          wall_id?: string;
          title?: string;
          description?: string | null;
          difficulty?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'boulders_wall_id_fkey';
            columns: ['wall_id'];
            referencedRelation: 'walls';
            referencedColumns: ['id'];
          },
        ];
      };
      boulder_photos: {
        Row: {
          id: string;
          boulder_id: string;
          url: string;
          order_index: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          boulder_id: string;
          url: string;
          order_index?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          boulder_id?: string;
          url?: string;
          order_index?: number;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'boulder_photos_boulder_id_fkey';
            columns: ['boulder_id'];
            referencedRelation: 'boulders';
            referencedColumns: ['id'];
          },
        ];
      };
      validations: {
        Row: {
          id: string;
          user_id: string;
          boulder_id: string;
          points_earned: number;
          validated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          boulder_id: string;
          points_earned: number;
          validated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          boulder_id?: string;
          points_earned?: number;
          validated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'validations_user_id_fkey';
            columns: ['user_id'];
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'validations_boulder_id_fkey';
            columns: ['boulder_id'];
            referencedRelation: 'boulders';
            referencedColumns: ['id'];
          },
        ];
      };
      favorites: {
        Row: {
          id: string;
          user_id: string;
          boulder_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          boulder_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          boulder_id?: string;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'favorites_user_id_fkey';
            columns: ['user_id'];
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'favorites_boulder_id_fkey';
            columns: ['boulder_id'];
            referencedRelation: 'boulders';
            referencedColumns: ['id'];
          },
        ];
      };
      comments: {
        Row: {
          id: string;
          user_id: string;
          boulder_id: string;
          content: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          boulder_id: string;
          content: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          boulder_id?: string;
          content?: string;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'comments_user_id_fkey';
            columns: ['user_id'];
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'comments_boulder_id_fkey';
            columns: ['boulder_id'];
            referencedRelation: 'boulders';
            referencedColumns: ['id'];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      is_gym_admin: {
        Args: {
          gym_uuid: string;
        };
        Returns: boolean;
      };
      get_gym_id_from_wall: {
        Args: {
          wall_uuid: string;
        };
        Returns: string;
      };
      get_gym_id_from_boulder: {
        Args: {
          boulder_uuid: string;
        };
        Returns: string;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

// Helper types for easier access
export type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row'];
export type InsertTables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Insert'];
export type UpdateTables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Update'];
