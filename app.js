let currentLang = "en";

document.getElementById("langToggle").onclick = () => {

currentLang = currentLang === "en" ? "ar" : "en";

document.querySelectorAll("[data-en]").forEach(el=>{

el.innerText = el.dataset[currentLang];

});

if(currentLang==="ar"){

document.body.style.direction="rtl";

document.body.style.fontFamily="Cairo";

document.getElementById("langToggle").innerText="EN";

}else{

document.body.style.direction="ltr";

document.body.style.fontFamily="Inter";

document.getElementById("langToggle").innerText="AR";

}

};
