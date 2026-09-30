/*
  # Create delete_user_data function

  1. Functions
    - `delete_user_data(target_user_id uuid)` - Deletes all user data across tables

  2. Security
    - Function can only be called by the user whose data is being deleted
*/

CREATE OR REPLACE FUNCTION delete_user_data(target_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Ensure the user can only delete their own data
  IF auth.uid() != target_user_id THEN
    RAISE EXCEPTION 'You can only delete your own data';
  END IF;

  -- Delete user data from all tables
  DELETE FROM ai_conversations WHERE user_id = target_user_id;
  DELETE FROM challenges WHERE user_id = target_user_id;
  DELETE FROM learning_progress WHERE user_id = target_user_id;
  DELETE FROM user_badges WHERE user_id = target_user_id;
  DELETE FROM financial_data WHERE user_id = target_user_id;
  DELETE FROM user_profiles WHERE user_id = target_user_id;
END;
$$;