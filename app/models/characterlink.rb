class Characterlink < ActiveRecord::Base
	belongs_to :trait
  after_create :setup_defaults
  attr_accessible :content, :link_type, :standards, :trait_id, :characterlink_order
  default_scope order('characterlink_order')


  def setup_defaults
    trait = Trait.find(self.trait_id)
    self.characterlink_order = trait.Characterlinks.count + 1
    self.save!
  end
  
end
