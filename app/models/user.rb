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
  validates :email, presence: true, uniqueness: true
  validates :first_name, :last_name, presence: true, length: { maximum: 50 }
  validates :bio, length: { maximum: 500 }
  
  # Methods
  def full_name
    [first_name, last_name].compact.join(' ')
  end
  
  def initials
    [first_name&.first, last_name&.first].compact.join('').upcase
  end
end
