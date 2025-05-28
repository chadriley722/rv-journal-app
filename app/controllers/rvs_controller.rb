class RvsController < ApplicationController
  before_action :authenticate_user!
  before_action :set_rv, only: [:show, :edit, :update, :destroy, :remove_image]
  before_action :authorize_user, only: [:show, :edit, :update, :destroy, :remove_image]

  def index
    @rvs = current_user.rvs.alphabetical
  end

  def show
  end

  def new
    @rv = current_user.rvs.new
  end

  def create
    @rv = current_user.rvs.new(rv_params)
    if @rv.save
      redirect_to dashboard_path, notice: 'RV was successfully added.'
    else
      render :new, status: :unprocessable_entity
    end
  end

  def edit
  end

  def update
    respond_to do |format|
      if @rv.update(rv_params)
        format.html { redirect_to dashboard_path, notice: 'RV was successfully updated.' }
        format.json { render :show, status: :ok, location: @rv }
      else
        format.html { render :edit, status: :unprocessable_entity }
        format.json { render json: @rv.errors, status: :unprocessable_entity }
      end
    end
  end
  
  def remove_image
    @rv.image.purge_later
    respond_to do |format|
      format.html { redirect_to edit_rv_path(@rv), notice: 'Image was successfully removed.' }
      format.json { head :no_content }
    end
  end

  def destroy
    @rv.destroy
    redirect_to dashboard_path, notice: 'RV was successfully removed.'
  end

  private

  def set_rv
    @rv = Rv.find(params[:id])
  end

  def authorize_user
    redirect_to dashboard_path, alert: 'Not authorized.' unless @rv.user == current_user
  end

  def rv_params
    params.require(:rv).permit(:name, :brand, :model, :rv_class, :year, :length, :description, :image)
  end
end
