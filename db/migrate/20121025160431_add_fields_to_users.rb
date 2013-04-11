class AddFieldsToUsers < ActiveRecord::Migration
  def change
    add_column :users, :is_private, :boolean
    add_column :users, :is_admin, :boolean
  end
end
