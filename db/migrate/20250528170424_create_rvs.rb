class CreateRvs < ActiveRecord::Migration[7.1]
  def change
    create_table :rvs do |t|
      t.references :user, null: false, foreign_key: true
      t.string :name, null: false
      t.string :brand
      t.string :model
      t.string :rv_class
      t.decimal :length, precision: 8, scale: 2
      t.integer :year
      t.text :description

      t.timestamps
    end
  end
end
