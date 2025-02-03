document.getElementById('crop_cultivation_calculator_cropForm').addEventListener('submit', function (e) {
  e.preventDefault(); // Prevent form submission

  // Get input values
  const length = parseFloat(document.getElementById('length').value);
  const width = parseFloat(document.getElementById('width').value);
  const unit = document.getElementById('unit').value;
  const spacing = parseFloat(document.getElementById('spacing').value);
  const spacingUnit = document.getElementById('spacingUnit').value;

  // Validate inputs
  if (isNaN(length) || isNaN(width) || isNaN(spacing) || length <= 0 || width <= 0 || spacing <= 0) {
      alert('Please enter valid positive numbers for all fields.');
      return;
  }

  // Convert length and width to meters based on selected land unit
  let lengthInMeters, widthInMeters;
  switch (unit) {
      case 'cm':
          lengthInMeters = length / 100;
          widthInMeters = width / 100;
          break;
      case 'm':
          lengthInMeters = length;
          widthInMeters = width;
          break;
      case 'ft':
          lengthInMeters = length * 0.3048;
          widthInMeters = width * 0.3048;
          break;
      case 'hectare':
          lengthInMeters = Math.sqrt(length * 10000);
          widthInMeters = Math.sqrt(width * 10000);
          break;
      case 'acre':
          lengthInMeters = Math.sqrt(length * 4046.86);
          widthInMeters = Math.sqrt(width * 4046.86);
          break;
      default:
          alert('Invalid land unit selected.');
          return;
  }

  // Convert spacing to meters based on selected spacing unit
  let spacingInMeters;
  switch (spacingUnit) {
      case 'cm':
          spacingInMeters = spacing / 100;
          break;
      case 'm':
          spacingInMeters = spacing;
          break;
      case 'ft':
          spacingInMeters = spacing * 0.3048;
          break;
      default:
          alert('Invalid spacing unit selected.');
          return;
  }

  // Calculate area of the land in square meters
  const areaInSquareMeters = lengthInMeters * widthInMeters;

  // Calculate number of plants
  const plantsPerRow = Math.floor(lengthInMeters / spacingInMeters);
  const plantsPerColumn = Math.floor(widthInMeters / spacingInMeters);
  const totalPlants = plantsPerRow * plantsPerColumn;

  // Convert area back to the selected land unit for display
  let areaInSelectedUnit;
  switch (unit) {
      case 'cm':
          areaInSelectedUnit = areaInSquareMeters * 10000;
          break;
      case 'm':
          areaInSelectedUnit = areaInSquareMeters;
          break;
      case 'ft':
          areaInSelectedUnit = areaInSquareMeters * 10.7639;
          break;
      case 'hectare':
          areaInSelectedUnit = areaInSquareMeters / 10000;
          break;
      case 'acre':
          areaInSelectedUnit = areaInSquareMeters / 4046.86;
          break;
  }

  // Display result
  const resultDiv = document.getElementById('crop_cultivation_calculator_result');
  resultDiv.innerHTML = `
      <h3>Calculation Results</h3>
      <p><strong>Total Area:</strong> ${areaInSelectedUnit.toFixed(2)} ${unit}</p>
      <p><strong>Spacing Between Plants:</strong> ${spacing} ${spacingUnit}</p>
      <p><strong>Number of Plants:</strong> ${totalPlants}</p>
  `;
  resultDiv.style.display = 'block';

  // Smooth scroll to the result section
  resultDiv.scrollIntoView({ behavior: 'smooth' });
});

// Show/Hide Example Functionality
document.getElementById('showExample').addEventListener('click', function () {
  const exampleDiv = document.getElementById('crop_cultivation_calculator_example');
  if (exampleDiv.style.display === 'none' || exampleDiv.style.display === '') {
      exampleDiv.style.display = 'block';
      exampleDiv.innerHTML = `
          <h3>Example Calculation</h3>
          <p><strong>Given:</strong></p>
          <ul>
              <li>Land Length = 10 meters</li>
              <li>Land Width = 5 meters</li>
              <li>Spacing = 1 meter</li>
          </ul>
          <p><strong>Formulas Used:</strong></p>
          <p>Area = Length × Width = 10 × 5 = <strong>50 m²</strong></p>
          <p>Plants per Row = Length / Spacing = 10 / 1 = <strong>10</strong></p>
          <p>Plants per Column = Width / Spacing = 5 / 1 = <strong>5</strong></p>
          <p>Total Plants = Plants per Row × Plants per Column = 10 × 5 = <strong>50</strong></p>
      `;
      this.textContent = 'Hide Example';

      // Scroll smoothly to example section
      exampleDiv.scrollIntoView({ behavior: 'smooth' });
  } else {
      exampleDiv.style.display = 'none';
      this.textContent = 'Show Example';
  }
});
