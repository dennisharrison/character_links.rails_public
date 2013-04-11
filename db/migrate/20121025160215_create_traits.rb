class CreateTraits < ActiveRecord::Migration
  def change
    create_table :traits do |t|
      t.integer :trait_order
      t.string :title
      t.boolean :scheduled
      t.string :schedule_field
      t.integer :trait_listing_id

      t.timestamps
    end
  end
end
