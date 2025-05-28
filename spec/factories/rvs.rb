FactoryBot.define do
  factory :rv do
    user { nil }
    name { "MyString" }
    brand { "MyString" }
    model { "MyString" }
    rv_class { "MyString" }
    length { "9.99" }
    year { 1 }
    description { "MyText" }
  end
end
