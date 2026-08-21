document.addEventListener("DOMContentLoaded", () => 
{
    const shotLength = document.getElementById("length");
    const shotReload = document.getElementById("shot");
    const salvoReload = document.getElementById("salvo");

    const result = document.getElementById("result");

    if (!shotLength || !shotReload || !result) 
    {
        return;
    }

    function CalculateRateOfFire() 
    {
        const length = parseInt(shotLength.value);
        const shot = parseFloat(shotReload.value);
        const salvo = parseFloat(salvoReload.value);

        if (isNaN(length) || isNaN(shot) || isNaN(salvo)) 
        {
            result.textContent = "Enter all Input Fields";
            return;
        }

        if (length < 0 || shot < 0 || salvo < 0) 
        {
            result.textContent = "Values must be positive";
            return;
        }

        const cycleTime = ((length - 1) * shot) + salvo;
        const rpm = (60 * length) / cycleTime;

        result.textContent = `${rpm.toFixed(2)} RPM`;
        
    }

    shotLength.addEventListener("input", CalculateRateOfFire);
    shotReload.addEventListener("input", CalculateRateOfFire);
    salvoReload.addEventListener("input", CalculateRateOfFire);

    CalculateRateOfFire();
});