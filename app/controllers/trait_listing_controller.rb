class TraitListingController < ApplicationController

  def present
    @trait_listing = TraitListing.find_by_title("CharacterLinks")
    @traits = @trait_listing.traits
  end

  def set_trait_order
    trait_listing = params[:trait_listing]
    trait_listing.each do |item|
      trait = Trait.find(item[1][:id])
      trait.trait_order = item[1][:trait_order]
      trait.schedule_field = item[1][:schedule_field]
      trait.save!
    end

    respond_to do |format|
      format.json { head :ok }
    end

  end

end
