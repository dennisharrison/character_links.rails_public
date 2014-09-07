class CharacterlinksController < ApplicationController

def index
    @characterlinks = Characterlink.all

    respond_to do |format|
      format.html {}
      format.json { render json: @characterlinks, root: false }
    end

  end

  def show
    @characterlink = Characterlink.find(params[:id])
    render 'show'
  end

  def new
    @characterlink = Characterlink.new
    render :partial => 'form', :layout => false
  end

  def create
    @characterlink = Characterlink.new(params[:characterlink])

    respond_to do |format|
      if @characterlink.save
        format.html { render action: 'edit', notice: 'Character Link was successfully created.' }
        format.js { head :ok }
        format.json { head :ok }
      else
        format.html { render action: 'edit' }
        format.js { render json: @characterlink.errors, status: :unprocessable_entity }
        format.json { render json: @characterlink.errors, status: :unprocessable_entity }
      end
    end
  end

  def edit
    @characterlink = Characterlink.find(params[:id])
    render 'edit'
  end

  def update
    @characterlink = Characterlink.find(params[:id])

    respond_to do |format|
      if @characterlink.update_attributes(params[:characterlink])
        format.html { render action: 'show', notice: 'Character Link was successfully updated.' }
        format.js { head :ok }
        format.json { head :ok }
      else
        format.html { render action: 'edit' }
        format.js { render json: @characterlink.errors, status: :unprocessable_entity }
        format.json { render json: @characterlink.errors, status: :unprocessable_entity }
      end
    end
  end

  def destroy
    characterlink = Characterlink.find(params[:id])

    respond_to do |format|
      if characterlink.destroy
        format.json { render json: characterlink }
      else
        format.json { render json: characterlink.errors, status: :unprocessable_entity }
      end
    end

  end

  def present
    @characterlink = characterlink.where('lower(link_type) = ?', params[:characterlink_type].downcase).first
  end

  def create_characterlink_for_trait
    trait_id = params[:trait_id]
    @characterlink = Characterlink.new
    @characterlink.trait_id = trait_id
    @characterlink.save!
    render action: 'edit'
  end
end
