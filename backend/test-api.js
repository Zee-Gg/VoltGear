async function checkAPI() {
  try {
    const response = await fetch('http://localhost:5000/api/v1/products?limit=5')
    const data = await response.json()
    
    console.log('\nAPI Response - First 3 Products:\n')
    data.data.slice(0, 3).forEach(product => {
      console.log(`${product.name}`)
      console.log(`  Images: ${product.images?.length || 0}`)
      if (product.images && product.images.length > 0) {
        console.log(`  First URL: ${product.images[0].substring(0, 80)}...`)
      }
      console.log()
    })
  } catch (error) {
    console.error('Error:', error.message)
  }
}

checkAPI()
