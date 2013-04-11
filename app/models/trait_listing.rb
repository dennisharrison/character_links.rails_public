class TraitListing < ActiveRecord::Base
  has_many :traits
  attr_accessible :description, :title
end
