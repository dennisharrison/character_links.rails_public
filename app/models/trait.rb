class Trait < ActiveRecord::Base
  belongs_to :trait_listing
  after_create :setup_defaults
  attr_accessible :schedule_field, :scheduled, :title, :trait_listing_id, :trait_order
  default_scope order('trait_order')


  def setup_defaults
    trait_listing = TraitListing.find_by_title("CharacterLinks")

    self.trait_order = trait_listing.traits.count + 1
    self.trait_listing_id = trait_listing.id
    self.save!

  end

end
