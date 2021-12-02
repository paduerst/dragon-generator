const urlParams = new URLSearchParams(window.location.search);

jQuery(document).ready(function($){
  
  // Remove empty fields from GET forms
  // Author: Bill Erickson
  // URL: http://www.billerickson.net/code/hide-empty-fields-get-form/
  
    // Change 'form' to class or ID of your specific form
  $("form").submit(function() {
    $(this).find(":input").filter(function(){ return (!this.value || this.value == "default"); }).attr("disabled", "disabled");
    $(this).find(":input").filter(function(){ return (this.value == "on"); }).attr("value", "1");
    return true; // ensure form still submits
  });
  
  // Un-disable form fields when page loads, in case they click back after submission
  // PD Note: This doesn't work as intended. jQuery doesn't run after back button
  $( "form" ).find( ":input" ).prop( "disabled", false );

  // disable advanced options unless otherwise specified
  if (urlParams.has("enableadvanced")) {
    document.getElementById("enableadvanced").checked=true;
  } else {
    $( "form" ).find( ".advanced-option" ).prop( "disabled", true );
    $( ".advanced-option-div" ).hide();
  }
});

function toggleAdvanced() {
  // Get the checkbox
  var checkBox = document.getElementById("enableadvanced");

  if (checkBox.checked == true){
    $( "form" ).find( ".advanced-option" ).prop( "disabled", false );
    $('.advanced-option-div').show();
  } else {
    $('.advanced-option-div').hide();
    $( "form" ).find( ".advanced-option" ).prop( "disabled", true );
  }
}

// copied from https://stackoverflow.com/a/6364985
function pageShown(evt){
  if (evt.persisted) {
      // alert("pageshow event handler called.  The page was just restored from the Page Cache (eg. From the Back button.");
      $( "form" ).find( ":input" ).prop( "disabled", false );
  } else {
      // alert("pageshow event handler called for the initial load.  This is the same as the load event.");
  }
  return;
}

function pageHidden(evt){
  if (evt.persisted) {
      // alert("pagehide event handler called.  The page was suspended and placed into the Page Cache.");
  } else {
      // alert("pagehide event handler called for page destruction.  This is the same as the unload event.");
  }
  return;
}

window.addEventListener("pageshow", pageShown, false);
window.addEventListener("pagehide", pageHidden, false);

// imported data
var dragons;
var templates;
var crs;
// end of imported data

// non-imported consts
const supported_ages = [
  "wyrmling",
  "young",
  "adult",
  "ancient"
];

const supported_colors = [
  "red",
  "orange",
  "yellow",
  "green",
  "blue",
  "indigo",
  "violet",
  "magenta",
  "white"
];

const css_color_themes = {
  "Red": [154, 21, 21],
  "Orange": [156, 87, 14],
  "Yellow": [143, 133, 1],
  "Green": [28, 128, 0],
  "Blue": [0, 100, 150],
  "Indigo": [31, 0, 156],
  "Violet": [118, 43, 158],
  "Magenta": [173, 12, 117],
  "White": [127, 128, 119]
};

const global_skills = [
  {"skill": "Acrobatics", "ability": "dex"},
  {"skill": "Animal Handling", "ability": "wis"},
  {"skill": "Arcana", "ability": "int"},
  {"skill": "Athletics", "ability": "str"},
  {"skill": "Deception", "ability": "cha"},
  {"skill": "History", "ability": "int"},
  {"skill": "Insight", "ability": "wis"},
  {"skill": "Intimidation", "ability": "cha"},
  {"skill": "Investigation", "ability": "int"},
  {"skill": "Medicine", "ability": "wis"},
  {"skill": "Nature", "ability": "int"},
  {"skill": "Perception", "ability": "wis"},
  {"skill": "Performance", "ability": "cha"},
  {"skill": "Persuasion", "ability": "cha"},
  {"skill": "Religion", "ability": "int"},
  {"skill": "Sleight of Hand", "ability": "dex"},
  {"skill": "Stealth", "ability": "dex"},
  {"skill": "Survival", "ability": "wis"}
];
// end of non-imported consts

// library for css customization
function setMonstersColor(r_val, g_val, b_val) {
  var monsters = document.getElementsByClassName("monster");
  for (let i = 0; i < monsters.length; i++) {
    setMonsterColor(monsters[i], r_val, g_val, b_val);
  }
}

function setMonsterColor(monster, r_val, g_val, b_val) {
  if (monster === undefined) {
    monster = document.getElementsByClassName("monster")[0];
  }
  const rgba_prefix = "rgba(" + r_val + ", " + g_val + ", " + b_val + ", ";

  monster.style["border-color"] = rgba_prefix + "1.0)";

  var h4s = monster.getElementsByTagName("h4");
  for (let i = 0; i < h4s.length; i++) {
    h4s[i].style.color = rgba_prefix + "1.0)";
  }

  var h5s = monster.getElementsByTagName("h5");
  for (let i = 0; i < h5s.length; i++) {
    h5s[i].style.color = rgba_prefix + "1.0)";
  }

  var abils = monster.getElementsByClassName("monster-abilities");
  for (let i = 0; i < abils.length; i++) {
    let abil_labels = abils[i].getElementsByClassName("label");
    for (let j = 0; j < abil_labels.length; j++) {
      abil_labels[j].style.color = rgba_prefix + "1.0)";
    }
  }

  var uls = monster.getElementsByTagName("ul");
  for (let i = 0; i < uls.length; i++) {
    let ul_labels = uls[i].getElementsByClassName("label");
    for (let j = 0; j < ul_labels.length; j++) {
      ul_labels[j].style.color = rgba_prefix + "1.0)";
    }
  }

  var hrs = monster.getElementsByTagName("hr");
  var start_opacity = "1.0";
  for (let i = 0; i < hrs.length; i++) {
    if (i == 0 || i == (hrs.length-1)) {
      start_opacity = "1.0";
    } else {
      start_opacity = "0.75";
    }
    hrs[i].style.background = "linear-gradient(to right, " + rgba_prefix + start_opacity + "), " + rgba_prefix + "0))";
  }

  var h5Borders = monster.getElementsByClassName("h5-border");
  for (let i = 0; i < h5Borders.length; i++) {
    h5Borders[i].style.background = "linear-gradient(to right, " + rgba_prefix + "0.75), " + rgba_prefix + "0))";
  }
}
// end of css customization library

// main library
// copied from https://www.codegrepper.com/code-examples/javascript/convert+number+to+string+with+commas+javascript
function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// copied from https://sebhastian.com/javascript-csv-to-array/
function csvToArray(str, delimiter = ",") {
  // slice from start of text to the first \n index
  // use split to create an array from string by delimiter
  const headers = str.slice(0, str.indexOf("\n")).split(delimiter);

  // slice from \n index + 1 to the end of the text
  // use split to create an array of each csv value row
  const rows = str.slice(str.indexOf("\n") + 1).split("\n");

  // Map the rows
  // split values from each row into an array
  // use headers.reduce to create an object
  // object properties derived from headers:values
  // the object passed as an element of the array
  const arr = rows.map(function (row) {
    const values = row.split(delimiter);
    const el = headers.reduce(function (object, header, index) {
      object[header.trim()] = values[index].trim();
      return object;
    }, {});
    return el;
  });

  // return the array
  return arr;
}

// Normalizes a string, by removing all non-alphanumeric characters and using mixed case to separate words. The output will always start with a lower case letter.
function normalizeHeader_(header) {
  var key = "";
  var upperCase = false;
  for (var i = 0; i < header.length; ++i) {
    var letter = header[i];
    if (letter == " " && key.length > 0) {
      upperCase = true;
      continue;
    }
    if (!isAlnum_(letter)) {
      continue;
    }
    if (key.length == 0 && isDigit_(letter)) {
      continue; // first character must be a letter
    }
    if (upperCase) {
      upperCase = false;
      key += letter.toUpperCase();
    } else {
      key += letter.toLowerCase();
    }
  }
  return key;
}

// Returns true if the character char is alphabetical, false otherwise.
function isAlnum_(char) {
  return char >= 'A' && char <= 'Z' ||
    char >= 'a' && char <= 'z' ||
    isDigit_(char);
}

// Returns true if the character char is a digit, false otherwise.
function isDigit_(char) {
  return char >= '0' && char <= '9';
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

// Replaces markers in a templates string with values from an array.
function insertVariablesToTemplate_(template, values) {
  var templateVars = template.match(/\$\{\"[^\"]+\"\}/g); // Search for all the variables to be replaced, for instance ${"Column name"}
  if (templateVars !== null) { // If there are no variable markers, just return the input template.
    for (var i = 0; i < templateVars.length; ++i) { // Replace variables with values from the data array.
      var variableData = values[normalizeHeader_(templateVars[i])]; // Returns the value from the object of the desired ID.
      template = template.replace(templateVars[i], variableData || ""); // If no value is available, replace with the empty string.
    }
  }
  return template;
}

function convertTagsToLinks_(strIn) {
  var tags = strIn.match(/[\[][^\/\]]{1,50}[\]][^\[\]]{1,50}[\[][^\]]{1,50}[\]]/g); // matches all DDB tags with contents
  if (tags === null) {
    return strIn; // If there are no tags, just return the input string.
  } else {
    for (var i = 0; i < tags.length; ++i) {
      var tag = tags[i];
      var firstBrackArr = tag.match(/[\[][^\/\]]{1,50}[\]]/g); // matches the first bracketed portion
      var firstBrack = firstBrackArr[0];
      var contentsArr = tag.match(/\[[^\/\]]{1,50}\][^\[\]]{1,50}(?=\[[^\]]{1,50}\])/g); // match all but last brack
      var contents = contentsArr[0];
      contents = contents.substring(firstBrack.length); // remove first brack from contents
      firstBrack = firstBrack.substring(1, firstBrack.length - 1); // remove the square brackets

      var contentsInURL;
      var link = '<a target="_blank" href="https://www.dndbeyond.com/';
      if (firstBrack == "spell") {
        contentsInURL = contents.toLowerCase().replace(/[ \/]/g, "-").replace(/[’']/, "");
        link = link + 'spells/';
      } else if (firstBrack == "skill") {
        contentsInURL = contents.charAt(0).toUpperCase() + contents.substring(1);
        link = link + 'sources/basic-rules/using-ability-scores#';
      } else if (firstBrack == "condition") {
        contentsInURL = contents.charAt(0).toUpperCase() + contents.substring(1);
        link = link + 'sources/basic-rules/appendix-a-conditions#';
      }
      link = link + contentsInURL + '">' + contents + '</a>';
      strIn = strIn.replace(tag, link); // Replace tag with the appropriate link
    }
    return strIn;
  }
}

function addUserSpecifiedValues(dragon) {
  // DM vs GM
  let dmgm = "DM";
  // not sure what the name of this urlParam should be. TODO: add this?
  dragon.dmgm = dmgm;

  // Number of Columns
  let number_of_columns = 2;
  if (urlParams.has("forcesinglecolumn")) {
    number_of_columns = 1;
    document.getElementById("forcesinglecolumn").checked=true;
  }
  // if (dragon.age == "Wyrmling") {
  //   number_of_columns = 1;
  // }
  // if (urlParams.has("columns")) {
  //   if (urlParams.get("columns") == 1) {
  //     number_of_columns = 1;
  //     // populate form with pronouns
  //     document.getElementById("columns1").checked = true;
  //     document.getElementById("columns2").checked = false;
  //   } else if (urlParams.get("columns") == 2) {
  //     number_of_columns = 2;
  //     // populate form with pronouns
  //     document.getElementById("columns1").checked = false;
  //     document.getElementById("columns2").checked = true;
  //   }
  // }
  dragon.numberOfColumns = number_of_columns;

  // The dragon vs Name
  let dragon_name = "the dragon";
  if (urlParams.has("name") && urlParams.get("name")!="") {
    dragon_name = urlParams.get("name");
    // populate form
    document.getElementById("name").value = dragon_name;
  }
  dragon.theDragonName = dragon_name;
  dragon.theDragonNameUpper = capitalizeFirstLetter(dragon_name);

  // Alignment
  if (urlParams.has("alignment") && urlParams.get("alignment")!="") {
    dragon.alignment = urlParams.get("alignment");
    // populate form
    document.getElementById("alignment").value = dragon.alignment;
  }

  // Pronouns
  let pronouns = "feminine";
  if (urlParams.has("pronouns")) {
    let input_pronouns = urlParams.get("pronouns");
    const supported_pronouns = ["neutral",
                                "feminine",
                                "masculine",
                                "singularthey",
                                "spivak"
    ];
    if (supported_pronouns.includes(input_pronouns)) {
      pronouns = input_pronouns;
    }
  }
  if (pronouns == "neutral") {
    // The default pronouns of most D&D 5e statblocks
    dragon.itshe = "it"; // nominative
    dragon.ither = "it"; // objective
    dragon.itsher = "its"; // possessive determiner
    // populate form with pronouns
    document.getElementById("pronouns").value = "neutral";
  } else if (pronouns == "feminine") {
    // Most prismatic dragons use these pronouns
    dragon.itshe = "she";
    dragon.ither = "her";
    dragon.itsher = "her";
    // populate form with pronouns
    document.getElementById("pronouns").value = "default";
  } else if (pronouns == "masculine") {
    // No known prismatic dragons use these pronouns
    dragon.itshe = "he";
    dragon.ither = "him";
    dragon.itsher = "his";
    // populate form with pronouns
    document.getElementById("pronouns").value = "masculine";
  } else if (pronouns == "singularthey") {
    // singular they
    dragon.itshe = "they";
    dragon.ither = "them";
    dragon.itsher = "their";
    // populate form with pronouns
    document.getElementById("pronouns").value = "singularthey";
  } else if (pronouns == "spivak") {
    // An example of nonbinary pronouns
    dragon.itshe = "ey";
    dragon.ither = "em";
    dragon.itsher = "eir";
    // populate form with pronouns
    document.getElementById("pronouns").value = "spivak";
  }
  dragon.itsheUpper = capitalizeFirstLetter(dragon.itshe);
  dragon.itherUpper = capitalizeFirstLetter(dragon.ither);
  dragon.itsherUpper = capitalizeFirstLetter(dragon.itsher);

  return dragon;
}

function addBackendCalculatedValues(dragon) {
  // These values are calculated in the Backend tab of my dragon spreadsheet
  // They were omitted from the dragons const to reduce its size
  // Proficiency Bonus
  var pb;
  if (dragon.cr < 5) {
    pb = 2;
  } else {
    pb = 1 + Math.ceil(dragon.cr/4);
  }
  dragon.proficiencyBonus = pb;

  // XP
  for (let i = 0; i < crs.length; i++) {
    if (dragon.cr == crs[i].cr) {
      dragon.xp = numberWithCommas(crs[i].xp);
      break;
    }
  }

  // Immunities
  dragon.immunities = dragon.immunity + dragon.additionalImmunities;

  // Ability Score Modifiers
  dragon.str = Math.floor((dragon.strength-10)/2);
  dragon.dex = Math.floor((dragon.dexterity-10)/2);
  dragon.con = Math.floor((dragon.constitution-10)/2);
  dragon.int = Math.floor((dragon.intelligence-10)/2);
  dragon.wis = Math.floor((dragon.wisdom-10)/2);
  dragon.cha = Math.floor((dragon.charisma-10)/2);
  var Mod;
  for (let mod of ["str", "dex", "con", "int", "wis", "cha"]) {
    if (dragon[mod] < 0) {
      dragon[mod + "WithSign"] = "-" + dragon[mod];
    } else {
      dragon[mod + "WithSign"] = "+" + dragon[mod];
    }
    Mod = capitalizeFirstLetter(mod);
    dragon["proficiency"+Mod] = dragon.proficiencyBonus + dragon[mod];
    dragon["saveDc"+Mod] = 8 + dragon.proficiencyBonus + dragon[mod];
  }

  // Hit Die
  var hitDie = 4;
  if (dragon.size == "Small") {
    hitDie = 6;
  } else if (dragon.size == "Medium") {
    hitDie = 8;
  } else if (dragon.size == "Large") {
    hitDie = 10;
  } else if (dragon.size == "Huge") {
    hitDie = 12;
  } else if (dragon.size == "Gargantuan") {
    hitDie = 20;
  }
  dragon.hitDie = hitDie;

  // Hit Points
  dragon.expectedHitPoints = Math.floor(dragon.numberOfHitDice*(0.5 + dragon.hitDie/2 + dragon.con));
  dragon.hpConMod = dragon.numberOfHitDice*dragon.con;

  // Passive Skills
  dragon.passiveInsight = 10 + dragon.wis + dragon.skillInsight*dragon.proficiencyBonus;
  dragon.passiveInvestigation = 10 + dragon.int + dragon.skillInvestigation*dragon.proficiencyBonus;
  dragon.passivePerception = 10 + dragon.wis + dragon.skillPerception*dragon.proficiencyBonus;

  // Expected Damages
  dragon.biteExpectedDamage = Math.floor(dragon.biteDiceCount*(0.5+dragon.biteDiceType/2) + dragon.str);
  dragon.biteElementExpectedDamage = Math.floor(dragon.biteElementDiceCount*(0.5+dragon.biteElementDiceType/2));
  dragon.clawExpectedDamage = Math.floor(dragon.clawDiceCount*(0.5+dragon.clawDiceType/2) + dragon.str);
  dragon.tailExpectedDamage = Math.floor(dragon.tailDiceCount*(0.5+dragon.tailDiceType/2) + dragon.str);
  dragon.breath1ExpectedDamage = Math.floor(dragon.breath1DiceCount*(0.5+dragon.breath1DiceType/2));
  dragon.wingAttackExpectedDamage = Math.floor(dragon.wingAttackDiceCount*(0.5+dragon.wingAttackDiceType/2) + dragon.str);

  return dragon;
}

function addGeneralDragonStatistics(dragon) {
  // Dragon Title
  if (dragon.age == "Wyrmling") {
    dragon.dragonTitle = "" + dragon.color + " Dragon " + dragon.age;
  } else {
    dragon.dragonTitle = "" + dragon.age + " " + dragon.color + " Dragon";
  }
  if (dragon.theDragonName != "the dragon") {
    dragon.dragonTitle = dragon.theDragonName + " (" + dragon.dragonTitle + ")";
  }

  // Speeds
  let speeds = "" + dragon.walkingSpeed + " ft.";
  if (dragon.burrowSpeed > 0) {
    speeds = speeds + ", burrow " + dragon.burrowSpeed + " ft.";
  }
  if (dragon.climbSpeed > 0) {
    speeds = speeds + ", climb " + dragon.climbSpeed + " ft.";
  }
  if (dragon.flyingSpeed > 0) {
    speeds = speeds + ", fly " + dragon.flyingSpeed + " ft.";
  }
  if (dragon.swimSpeed > 0) {
    speeds = speeds + ", swim " + dragon.swimSpeed + " ft.";
  }
  dragon.speeds = speeds;

  // Saving Throws
  // all prismatic dragons have proficiency in DEX, CON, WIS, and CHA saves
  // assume none of the saving throw mods (with proficiency) are negative
  dragon.savingThrows = "DEX +" + dragon.proficiencyDex +
                        ", CON +" + dragon.proficiencyCon +
                        ", WIS +" + dragon.proficiencyWis +
                        ", CHA +" + dragon.proficiencyCha;

  // Skills
  let skills_arr = [];
  var skill_key;
  var skill_prof;
  var skill_mod;
  var skill_sign;
  for (let i = 0; i < global_skills.length; i++) {
    skill_key = normalizeHeader_("Skill " + global_skills[i].skill);
    skill_prof = dragon[skill_key];
    if (skill_prof > 0) {
      skill_mod = dragon[global_skills[i].ability] +
                  skill_prof*dragon.proficiencyBonus;
      if (skill_mod < 0) {
        skill_sign = "-";
      } else {
        skill_sign = "+";
      }
      skills_arr.push(global_skills[i].skill + " " + skill_sign + skill_mod);
    }
  }
  for (let i = 0; i < skills_arr.length; i++) {
    skills_arr[i] = "<span class=\"nowrap\">" + skills_arr[i] + "</span>";
  }
  dragon.skills = skills_arr.join(", ");

  // Cantrip
  const spell_prefix = "<i>[spell]";
  const spell_suffix = "[/spell]</i>";
  dragon.cantrip = spell_prefix + dragon.rawCantrip + spell_suffix;

  // Spells
  let spells_arr = dragon.rawSpells.split(",");
  var spell_arr;
  var spell;
  var parenthetical;
  for (let i = 0; i < spells_arr.length; i++) {
    spell_arr = spells_arr[i].split("(");
    spell = spell_arr[0].trim();
    if (spell_arr.length > 1) {
      parenthetical = " (" + spell_arr[1].trim();
    } else {
      parenthetical = "";
    }
    spells_arr[i] = spell_prefix + spell + spell_suffix + parenthetical;
  }
  dragon.spells = spells_arr.sort().join(", ");

  return dragon;
}

function addCaseVariants(dragon) {
  const vals_to_vary = [
    "immunity",
    "immunities",
    "resistances",
    "vulnerability",
    "color",
    "age"
  ];
  for (let val of vals_to_vary) {
    dragon[val + "Upper"] = capitalizeFirstLetter(dragon[val]);
    dragon[val + "Lower"] = dragon[val].toLowerCase();
    dragon[val + "Caps"] = dragon[val].toUpperCase();
  }
  return dragon
}

function generateFeaturesArray_(dragon) {
  var out_arr = [];

  if (dragon.amphibious > 0) {
    out_arr.push(insertVariablesToTemplate_(templates.amphibious, dragon));
  }

  if (dragon.iceWalk > 0) {
    out_arr.push(insertVariablesToTemplate_(templates.iceWalk, dragon));
  }

  // Innate Spellcasting
  if (dragon.age == "Wyrmling" || urlParams.has("noleveledspells")) {
    out_arr.push(insertVariablesToTemplate_(templates.innateSpellcastingDescriptionWyrmling, dragon));
    out_arr.push(insertVariablesToTemplate_(templates.innateSpellcastingCantrip, dragon));
    if (urlParams.has("noleveledspells")) {
      // populate form
      document.getElementById("noleveledspells").checked = true;
    }
  } else {
    out_arr.push(insertVariablesToTemplate_(templates.innateSpellcastingDescriptionAdult, dragon));
    out_arr.push(insertVariablesToTemplate_(templates.innateSpellcastingCantrip, dragon));
    out_arr.push(insertVariablesToTemplate_(templates.innateSpellcastingSpells, dragon));
  }

  if (dragon.legendaryResistances > 0) {
    out_arr.push(insertVariablesToTemplate_(templates.legendaryResistance, dragon));
  }

  out_arr.push(insertVariablesToTemplate_(templates.magicResistance, dragon));

  if (dragon.legendaryResistances > 0) {
    out_arr.push(insertVariablesToTemplate_(templates.magicWeapons, dragon));
  }

  if (urlParams.has("usealtvulnerability")) {
    let features_lost = "Innate Spellcasting, Magic Resistance, ";
    if (urlParams.has("nowallofcolor") || !((dragon.age == "Adult" || dragon.age == "Ancient") && dragon.color != "White")) {
      features_lost = features_lost + "and Variable Radiance";
    } else {
      features_lost = features_lost + "Variable Radiance, and Wall of Prismatic " + dragon.colorUpper;
    }
    dragon.altVulnerabilityFeaturesLost = features_lost;
    out_arr.push(insertVariablesToTemplate_(templates["altVulnerability" + dragon.color], dragon));
    // populate form
    document.getElementById("usealtvulnerability").checked = true;
  }

  return out_arr;
}

function generateActionsArray_(dragon) {
var out_arr = [];

// Multiattack
if (dragon.age == "Wyrmling") {
  // no multiattack
} else if (dragon.age == "Young") {
  out_arr.push(insertVariablesToTemplate_(templates.multiattackYoung, dragon));
} else {
  out_arr.push(insertVariablesToTemplate_(templates.multiattackAdult, dragon));
}
out_arr.push(insertVariablesToTemplate_(templates.bite, dragon));
if (dragon.clawReach > 0) {
  out_arr.push(insertVariablesToTemplate_(templates.claw, dragon));
}
if (dragon.tailReach > 0) {
  out_arr.push(insertVariablesToTemplate_(templates.tail, dragon));
}
if (dragon.age == "Adult" || dragon.age == "Ancient") {
  out_arr.push(insertVariablesToTemplate_(templates.frightfulPresence, dragon));
}

// Breath Weapons
let breathColor = "breath" + dragon.colorUpper;
if (urlParams.has("nosecondbreath")) {
  out_arr.push(insertVariablesToTemplate_(templates[breathColor + "Wyrmling"], dragon));
  // populate form to reflect no second breath
  document.getElementById("nosecondbreath").checked=true;
} else {
  // out_arr.push(insertVariablesToTemplate_(templates.breathPrefix, dragon));
  out_arr.push(insertVariablesToTemplate_(templates[breathColor + "1"], dragon));
  if (dragon.color != "Violet") {
    out_arr.push(insertVariablesToTemplate_(templates[breathColor + "2"], dragon));
  } else {
    let breathStart = insertVariablesToTemplate_(templates[breathColor + "2"], dragon);
    let breathEnd;
    if (dragon.age == "Adult" || dragon.age == "Ancient") {
      breathEnd = insertVariablesToTemplate_(templates[breathColor + "2EndAdult"], dragon)
    } else {
      breathEnd = insertVariablesToTemplate_(templates[breathColor + "2EndYoung"], dragon)
    }
    out_arr.push(breathStart + breathEnd);
  }
}

// Wall of Prismatic Color
if (urlParams.has("nowallofcolor")) {
  // no wall of color
  // populate form to reflect no wall of color
  document.getElementById("nowallofcolor").checked=true;
} else if ((dragon.age == "Adult" || dragon.age == "Ancient") && dragon.color != "White") {
  out_arr.push(insertVariablesToTemplate_(templates.wallOfPrismaticColorNew, dragon));
}

return out_arr;
}

function generateBonusActionsArray_(dragon) {
var out_arr = [];

// Change Shape
if (urlParams.has("nochangeshape")) {
  // no change shape
  // populate form to reflect no change shape
  document.getElementById("nochangeshape").checked=true;
} else if (dragon.age == "Adult" || dragon.age == "Ancient") {
  out_arr.push(insertVariablesToTemplate_(templates.changeShape, dragon));
}

out_arr.push(insertVariablesToTemplate_(templates.prismaticRadiance, dragon));

return out_arr;
}
// end of main library

function generateDragon() {
  // specify type of dragon
  var dragon_color = "Red";
  var input_color;
  if (urlParams.has("color")) {
    input_color = urlParams.get("color").trim().toLowerCase();
    if (supported_colors.includes(input_color)) {
      dragon_color = capitalizeFirstLetter(input_color);
    }
  }
  var dragon_age = "Young";
  var input_age;
  if (urlParams.has("age")) {
    input_age = urlParams.get("age").trim().toLowerCase();
    if (supported_ages.includes(input_age)) {
      dragon_age = capitalizeFirstLetter(input_age);
    }
  }
  // end of dragon specification

  // populate form with current values
  document.getElementById("color").value = dragon_color.toLowerCase();
  document.getElementById("age").value = dragon_age.toLowerCase();

  // generate the dragon statblock
  var dragon_key = normalizeHeader_(dragon_color + " " + dragon_age);
  var dragon = dragons[dragon_key];

  // add the other dragon values needed
  dragon = addUserSpecifiedValues(dragon);
  dragon = addBackendCalculatedValues(dragon);
  dragon = addGeneralDragonStatistics(dragon);
  dragon = addCaseVariants(dragon);

  // start constructing the output array of strings of HTML
  var out_arr = [];
  out_arr.push(insertVariablesToTemplate_(templates.htmlMonsterStart, dragon));
  out_arr.push(insertVariablesToTemplate_(templates.htmlMonsterHeader, dragon));
  out_arr.push(insertVariablesToTemplate_(templates.htmlAcHpSpeeds, dragon));
  out_arr.push(insertVariablesToTemplate_(templates.htmlAbilityScores, dragon));

  out_arr.push(insertVariablesToTemplate_(templates.htmlMonsterStatsStart, dragon));
  out_arr.push(insertVariablesToTemplate_(templates.htmlMonsterStatSaves, dragon));
  out_arr.push(insertVariablesToTemplate_(templates.htmlMonsterStatSkills, dragon));
  if (!urlParams.has("usealtvulnerability")) {
    out_arr.push(insertVariablesToTemplate_(templates.htmlMonsterStatVulnerabilities, dragon));
  }
  if (dragon.age == "Adult")
  {
    out_arr.push(insertVariablesToTemplate_(templates.htmlMonsterStatResistances, dragon));
  }
  out_arr.push(insertVariablesToTemplate_(templates.htmlMonsterStatImmunities, dragon));
  out_arr.push(insertVariablesToTemplate_(templates.htmlMonsterStatSenses, dragon));
  out_arr.push(insertVariablesToTemplate_(templates.htmlMonsterStatLanguages, dragon));
  out_arr.push(insertVariablesToTemplate_(templates.htmlMonsterStatChallenge, dragon));
  out_arr.push(insertVariablesToTemplate_(templates.htmlMonsterStatsEnd, dragon));

  out_arr.push(insertVariablesToTemplate_(templates.htmlTitleTraits, dragon));
  out_arr = out_arr.concat(generateFeaturesArray_(dragon));

  out_arr.push(insertVariablesToTemplate_(templates.htmlTitleActions, dragon));
  var actionsArray = generateActionsArray_(dragon);
  for (let i = 0; i < actionsArray.length; i++) {
    out_arr.push(actionsArray[i]);
    if (i == 0) {
      out_arr.push(templates.htmlDivEnd);
    }
  }

  out_arr.push(insertVariablesToTemplate_(templates.htmlTitleBonusActions, dragon));
  var bonusActionsArray = generateBonusActionsArray_(dragon);
  for (let i = 0; i < bonusActionsArray.length; i++) {
    out_arr.push(bonusActionsArray[i]);
    if (i == 0) {
      out_arr.push(templates.htmlDivEnd);
    }
  }

  if (dragon.legendaryResistances > 0) {
    out_arr.push(insertVariablesToTemplate_(templates.htmlTitleLegendaryActions, dragon));
    out_arr.push(insertVariablesToTemplate_(templates.legendaryDescription, dragon));
    out_arr.push(insertVariablesToTemplate_(templates.legendaryDetect, dragon));
    out_arr.push(insertVariablesToTemplate_(templates.legendaryTailAttack, dragon));
    out_arr.push(insertVariablesToTemplate_(templates.legendaryWingAttack, dragon));
  }

  out_arr.push(insertVariablesToTemplate_(templates.htmlMonsterEnd, dragon));
  var output = out_arr.join("\n");
  output = convertTagsToLinks_(output);
  document.getElementById("dragon-destination").innerHTML = output;
  // end of dragon statblock generation

  // change stat block colors to match dragon color
  if (urlParams.has("usestandardtheme")) {
    // use standard theme
    document.getElementById("usestandardtheme").checked=true;
  } else {
    let new_theme = css_color_themes[dragon_color];
    setMonstersColor(new_theme[0], new_theme[1], new_theme[2]);
  }

  // modify grammatical tense for singular they
  if (dragon.itshe == "they") {
    var affected_spans = document.getElementsByClassName("affected-by-they");
    for (let i = 0; i < affected_spans.length; i++) {
      let affected_span = affected_spans[i];
      affected_span.innerHTML = affected_span.getAttribute("data-they");
    }
  }

  // make page look like it would if you were printing
  if (urlParams.has("printpreview")) {
    var all_links = document.getElementsByTagName('a');
    for (let i = 0; i < all_links.length; i++) {
      let link_i = all_links[i];
      link_i.style.color = 'black';
      link_i.style.textDecoration = 'none !important';
    }
    var all_monsters = document.getElementsByClassName('monster');
    for (let i = 0; i < all_monsters.length; i++) {
      let monster_i = all_monsters[i];
      monster_i.style.borderWidth = '2px';
      monster_i.style.borderTopWidth = '5px';
      monster_i.style.borderBottomWidth = '5px';
      monster_i.style.width = '100%';
    }
    document.getElementsByClassName("customization-menu")[0].style.display = "none";
  }

  // update style so it prints just the statblock
  if (urlParams.has("printcropped")) {
      document.getElementById("printcropped").checked=true;
    var print_style = '@page {size: 900px 1500px; margin: 0px;}';
    var print_element  = $('#print-cropped-style');
    print_element.text(print_style);
  }
}

// import dragons and templates from JSON files
function importDragons() {
  var request = new XMLHttpRequest();
  request.open("GET", "data/dragon_vals.json", true);
  request.send(null);
  request.onreadystatechange = function() {
    if ( request.readyState === 4 && request.status === 200 ) {
      dragons = JSON.parse(request.responseText);
      console.log(dragons);
      importTemplates();
    }
  }
}

function importTemplates() {
  var request = new XMLHttpRequest();
  request.open("GET", "data/feature_templates.json", true);
  request.send(null);
  request.onreadystatechange = function() {
    if ( request.readyState === 4 && request.status === 200 ) {
      templates = JSON.parse(request.responseText);
      console.log(templates);
      importCrs();
    }
  }
}

function importCrs() {
  var request = new XMLHttpRequest();
  request.open("GET", "data/cr_table.csv", true);
  request.send(null);
  request.onreadystatechange = function() {
    if ( request.readyState === 4 && request.status === 200 ) {
      crs = csvToArray(request.responseText);
      console.log(crs);
      generateDragon();
    }
  }
}

// import values then generate the dragon
importDragons();