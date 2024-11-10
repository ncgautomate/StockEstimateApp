// script.js

function performCalculations() {
    // Get input values
    const investmentAmount = parseFloat(document.getElementById('investmentAmount').value);
    const buyPrice = parseFloat(document.getElementById('buyPrice').value);
    const sellPrice = parseFloat(document.getElementById('sellPrice').value || 0); // Optional sell price

    // Validate inputs
    if (isNaN(investmentAmount) || isNaN(buyPrice) || investmentAmount <= 0 || buyPrice <= 0) {
        alert('Please enter valid positive numbers for Investment Amount and Buy Price.');
        return;
    }

    // Calculate Total Shares
    const totalShares = investmentAmount / buyPrice;

    // Calculate Total Buy Price
    const totalBuyPrice = totalShares * buyPrice;

    // Calculate Total Sell Price (if sellPrice is provided)
    const totalSellPrice = sellPrice > 0 ? totalShares * sellPrice : 0;

    // Calculate Average Price
    const averagePrice = (totalBuyPrice + (sellPrice > 0 ? totalSellPrice : 0)) / (sellPrice > 0 ? 2 : 1);

    // Display results
    document.getElementById('totalShares').innerText = `Total Shares: ${totalShares.toFixed(2)}`;
    document.getElementById('totalBuyPrice').innerText = `Total Buy Price: $${totalBuyPrice.toFixed(2)}`;
    if (sellPrice > 0) {
        document.getElementById('totalSellPrice').innerText = `Total Sell Price: $${totalSellPrice.toFixed(2)}`;
    } else {
        document.getElementById('totalSellPrice').innerText = '';
    }
    document.getElementById('averagePrice').innerText = `Average Price per Share: $${averagePrice.toFixed(2)}`;
}

// Attach the function to the global window object to make it accessible from the HTML
window.performCalculations = performCalculations;
