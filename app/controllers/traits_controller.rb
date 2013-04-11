class TraitsController < ApplicationController

  def index
    @traits = Trait.all

    respond_to do |format|
      format.html {}
      format.json { render json: @traits, root: false }
    end

  end

  def show
    @trait = Trait.find(params[:id])
    render :partial => 'show', :layout => false
  end

  def new
    @trait = Trait.new
    render :partial => 'form', :layout => false
  end

  def create
    @trait = Trait.new(params[:trait])

    respond_to do |format|
      if @trait.save
        format.html { render action: 'edit', notice: 'Trait was successfully created.' }
        format.js { head :ok }
        format.json { head :ok }
      else
        format.html { render action: 'edit' }
        format.js { render json: @trait.errors, status: :unprocessable_entity }
        format.json { render json: @trait.errors, status: :unprocessable_entity }
      end
    end
  end

  def edit
    @trait = Trait.find(params[:id])
    render :partial => 'form', :layout => false
  end

  def update
    @trait = Trait.find(params[:id])

    respond_to do |format|
      if @trait.update_attributes(params[:trait])
        format.html { render action: 'index', notice: 'Trait was successfully updated.' }
        format.js { head :ok }
        format.json { head :ok }
      else
        format.html { render action: 'edit' }
        format.js { render json: @trait.errors, status: :unprocessable_entity }
        format.json { render json: @trait.errors, status: :unprocessable_entity }
      end
    end
  end

  def duplicate
    trait = Trait.find(params[:trait_id])
    new_trait = trait.dup
    new_trait.save!
    respond_to do |format|
      format.html {}
      format.json { render json: new_trait, root: false }
    end
  end

  def destroy
    trait = Trait.find(params[:id])

    respond_to do |format|
      if trait.destroy
        format.json { render json: trait }
      else
        format.json { render json: trait.errors, status: :unprocessable_entity }
      end
    end

  end

  def present
    @trait = Trait.where('lower(title) = ?', params[:trait_title].downcase).first
  end

end
