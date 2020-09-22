resource "random_integer" "length" {
  max = 20
  min = 4

  keepers = {
    uuid = uuid()
  }
}

resource "random_pet" "main" {
  length = random_integer.length.result
}
