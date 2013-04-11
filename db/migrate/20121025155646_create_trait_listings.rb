class CreateTraitListings < ActiveRecord::Migration
  def change
    create_table :trait_listings do |t|
      t.string :title
      t.text :description

      t.timestamps
    end
  end
end
