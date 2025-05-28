class Rv < ApplicationRecord
  belongs_to :user
  has_one_attached :image

  # Virtual attribute for removing the image
  attr_accessor :remove_image

  # Validations
  validates :name, presence: true
  validates :year, numericality: { only_integer: true, greater_than_or_equal_to: 1900, less_than_or_equal_to: Date.current.year + 1 }, allow_blank: true
  validates :length, numericality: { greater_than: 0, allow_blank: true }
  validate :validate_image

  # Scopes
  scope :alphabetical, -> { order(:name) }

  # Validate image content type and size
  after_save :purge_image, if: :remove_image

  private

  def validate_image
    return unless image.attached?
    
    if image.blob.byte_size > 5.megabytes
      errors.add(:image, 'is too large (max 5MB)')
    elsif !image.content_type.in?(%w[image/jpeg image/png image/gif])
      errors.add(:image, 'must be a JPEG, PNG, or GIF')
    end
  end

  def purge_image
    image.purge_later
  end
end
