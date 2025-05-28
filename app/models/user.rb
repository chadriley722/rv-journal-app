class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable, :trackable
         
  # Active Storage attachment for profile picture
  has_one_attached :profile_picture
  
  # Associations (to be expanded as we add more models)
  has_many :rvs, dependent: :destroy
  has_many :journal_entries, dependent: :destroy
  has_many :maintenance_records, dependent: :destroy
  
  # Validations
  validates :username, presence: true, uniqueness: { case_sensitive: false }, length: { minimum: 3, maximum: 30 },
                      format: { with: /\A[a-zA-Z0-9_]+\z/, message: "can only contain letters, numbers, and underscores" }
  validates :email, presence: true, uniqueness: true, format: { with: URI::MailTo::EMAIL_REGEXP }
  validates :password, presence: true, length: { minimum: 6 }, if: :password_required?
  validates :password_confirmation, presence: true, if: :password_required?
  
  # Methods
  def full_name
    username
  end
  
  def initials
    [first_name&.first, last_name&.first].compact.join('').upcase
  end
  
  def has_rv?
    rvs.any?
  end
end
