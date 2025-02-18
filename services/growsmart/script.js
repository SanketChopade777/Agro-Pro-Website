document.getElementById('crop_cultivation_calculator_cropForm').addEventListener('submit', function (e) {
    e.preventDefault(); // Prevent form submission

    // Get input values
    let length = parseFloat(document.getElementById('length').value);
    let width = parseFloat(document.getElementById('width').value);
    let border = parseFloat(document.getElementById('border').value);
    const unit = document.getElementById('unit').value;
    const spacing = parseFloat(document.getElementById('spacing').value);
    const spacingUnit = document.getElementById('spacingUnit').value;
    const plantingMethod = document.getElementById('plantingMethod').value;

    // Validate border
    if (border >= length / 2 || border >= width / 2) {
        alert('Border value is too large. It must be less than half of the length and width.');
        return;
    }
    if(border != 0){
        // Adjust length and width for border
        width -= border * 2;
        length -= border * 2;
    }
    
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
        case 'inch':
            lengthInMeters = length * 0.0254;
            widthInMeters = width * 0.0254;
            break;
        case 'ft':
            lengthInMeters = length * 0.3048;
            widthInMeters = width * 0.3048;
            break;
        case 'yd':
            lengthInMeters = length * 0.9144;
            widthInMeters = width * 0.9144;
            break;
        default:
            alert('Invalid land unit selected.');
            return;
    }

    // Convert spacing to meters based on selected spacing unit
    let spacingInMeters, fact;
    switch (spacingUnit) {
        case 'cm':
            spacingInMeters = spacing / 100;
            fact = 0.01;
            break;
        case 'm':
            spacingInMeters = spacing;
            fact = 1;
            break;
        case 'inch':
            spacingInMeters = spacing * 0.0254;
            fact = 0.0254;
            break;
        case 'ft':
            spacingInMeters = spacing * 0.3048;
            fact = 0.3048;
            break;
        case 'yd':
            spacingInMeters = spacing * 0.9144;
            fact = 0.9144;
            break;
        default:
            alert('Invalid spacing unit selected.');
            return;
    }

    // Calculate area of the land in square meters
    const areaInSquareMeters = lengthInMeters * widthInMeters;

    // Calculate number of plants based on planting method
    let totalPlants;
    if (plantingMethod === 'rectangle_grid' || plantingMethod === 'square_grid' ) {
        console.log()
        const plantsPerRow = Math.floor(lengthInMeters / spacingInMeters);
        const plantsPerColumn = Math.floor(widthInMeters / spacingInMeters);
        totalPlants = plantsPerRow * plantsPerColumn;
    } else if (plantingMethod === 'triangle_grid') {
        const rowSpacing = (spacingInMeters * 0.866);
        const plantsPerRow = (lengthInMeters / rowSpacing); // Use Math.ceil
        const plantsPerColumn = Math.floor(widthInMeters / spacingInMeters);
        totalPlants = Math.ceil(plantsPerRow * plantsPerColumn);
    } else if (plantingMethod === 'pairedRow') {
        let pairedRowDistance = parseFloat(document.getElementById('pairedRowDistance').value);
        let interRowDistance = parseFloat(document.getElementById('interRowDistance').value);

        // Validate pairedRowDistance and interRowDistance
        if (isNaN(pairedRowDistance) || isNaN(interRowDistance) || pairedRowDistance <= 0 || interRowDistance <= 0) {
            alert('Please enter valid positive numbers for paired row and inter-row distances.');
            return;
        }

        // Convert to meters
        pairedRowDistance *= fact;
        interRowDistance *= fact;

        const meanDistance = (pairedRowDistance + interRowDistance) / 2;
        totalPlants = Math.floor(areaInSquareMeters / (meanDistance * spacingInMeters));
    }

    // Convert area back to the selected land unit for display
    let areaInSelectedUnit;
    switch (unit) {
        case 'cm':
            areaInSelectedUnit = areaInSquareMeters * 10000;
            break;
        case 'm':
            areaInSelectedUnit = areaInSquareMeters;
            break;
        case 'inch':
            areaInSelectedUnit = areaInSquareMeters * 1550.0031;
            break;
        case 'ft':
            areaInSelectedUnit = areaInSquareMeters * 10.7639;
            break;
        case 'yd':
            areaInSelectedUnit = areaInSquareMeters * 1.195960;
            break;
    }

    // Display result
    const resultDiv = document.getElementById('crop_cultivation_calculator_result');
    resultDiv.innerHTML = `
        <h3>Calculation Results</h3>
        <p><strong>Total Area:</strong> ${areaInSelectedUnit.toFixed(2)} ${unit}</p>
        <p><strong>Spacing Between Plants (Plant to Plant Distance):</strong> ${spacing} ${spacingUnit}</p>
        <p><strong>Number of Plants:</strong> ${totalPlants}</p>
    `;
    resultDiv.style.display = 'block';

    resultDiv.scrollIntoView({ behavior: 'smooth' });
});
  
  // Show/Hide Example Functionality
  document.getElementById('showExample').addEventListener('click', function () {
    const exampleDiv = document.getElementById('crop_cultivation_calculator_example');
    if (exampleDiv.style.display === 'none' || exampleDiv.style.display === '') {
        exampleDiv.style.display = 'block';
        const plantingMethod = document.getElementById('plantingMethod').value;
        if(plantingMethod === 'square_grid'){
            exampleDiv.innerHTML = `
            <h3>Example Calculation</h3>
            <p><strong>Given:</strong></p>
            <p><strong>Here, in the Square Grid Length==Width</strong></p>
            <ul>
                <li>Land Length = Width = 10 meters</li>
                <li>Spacing (Plant to Plat Distance) = 1 meter</li>
            </ul>
            <p><strong>Formulas Used:</strong></p>
            <p>Area = Length × Width = 10 × 10 = <strong>100 m²</strong></p>
            <p>Plants per Row = Length / Spacing = 10 / 1 = <strong>10</strong></p>
            <p>Plants per Column = Width / Spacing = 10 / 1 = <strong>10</strong></p>
            <p>Total Plants = Plants per Row × Plants per Column = 10 × 10 = <strong>100</strong></p>
        `;
        }
        else if(plantingMethod === 'rectangle_grid'){
            exampleDiv.innerHTML = `
            <h3>Example Calculation</h3>
            <p><strong>Given:</strong></p>
            <ul>
                <li>Land Length = 10 meters</li>
                <li>Land Width = 5 meters</li>
                <li>Spacing (Plant to Plat Distance) = 1 meter</li>
            </ul>
            <p><strong>Formulas Used:</strong></p>
            <p>Area = Length × Width = 10 × 5 = <strong>50 m²</strong></p>
            <p>Plants per Row = Length / Spacing = 10 / 1 = <strong>10</strong></p>
            <p>Plants per Column = Width / Spacing = 5 / 1 = <strong>5</strong></p>
            <p>Total Plants = Plants per Row × Plants per Column = 10 × 5 = <strong>50</strong></p>
        `;
        }
        else if(plantingMethod === 'triangle_grid'){
            exampleDiv.innerHTML = `
            <h3>Example Calculation</h3>
            <p><strong>Given:</strong></p>
            <ul>
                <li>Land Length = 10 meters</li>
                <li>Land Width = 5 meters</li>
                <li>Spacing (Plant to Plat Distance) = 1 meter</li>
            </ul>
            <p><strong>Formulas Used:</strong></p>
            <p>Area = Length × Width = 10 × 5 = <strong>50 m²</strong></p>
            <p>Row Spacing = Spacing × 0.866 = 1 × 0.866  = <strong>0.866</strong></p>
            <p>Plants per Row = Length / Row Spacing = 10 / 0.866 = <strong>11.5473</strong></p>
            <p>Plants per Column = Width / Spacing = 5 / 1 = <strong>5</strong></p>
            <p>Total Plants = Plants per Row × Plants per Column = 11.5473 × 5 = <strong>58</strong></p>
        `;
        }
        else if(plantingMethod === 'pairedRow'){
            exampleDiv.innerHTML = `
            <h3>Example Calculation</h3>
            <p><strong>Given:</strong></p>
            <ul>
                <li>Land Length = 100 meters</li>
                <li>Land Width = 100 meters</li>
                <li>Spacing (Plant to Plat Distance) = 0.3 meter</li>
                <li>Paired Row Distance = 0.9 meter</li>
                <li>Interrow Distance = 0.6 meter</li>
            </ul>
            <p><strong>Formulas Used:</strong></p>
            <p>Area = Length × Width = 100 × 100 = <strong>10000 m²</strong></p>
            <p>Mean of (PairedRow & InterRow Distance) = (PairedRow Distance + InterRow Distance)/ 2 = (0.9+0.6) / 2 = (1.5/2)= <strong>0.75</strong></p>
            <p>Mean * Spacing = 0.75 * 0.3 = <strong>0.225</strong></p>
            <p>Total Plants = Area / (Mean * Spacing) = 10000 / 0.225 = <strong>44444</strong></p>
        `;
        }
        else{
            alert("Plz select a Planting Method! To see Example :)");
        }
        this.textContent = 'Hide Example';
        exampleDiv.scrollIntoView({ behavior: 'smooth' });
    } else {
        exampleDiv.style.display = 'none';
        this.textContent = 'Show Example';
    }
  });
  