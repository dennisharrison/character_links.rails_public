class CreateCharacterlinks < ActiveRecord::Migration
  def change
    create_table :characterlinks do |t|
      t.integer :trait_id
      t.integer :characterlink_order
      t.string :link_type
      t.text :content
      t.text :standards

      t.timestamps
    end
  end
end
