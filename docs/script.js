const urlParams = new URLSearchParams(window.location.search);

jQuery(document).ready(function($){
  
  // Remove empty fields from GET forms
  // Author: Bill Erickson
  // URL: http://www.billerickson.net/code/hide-empty-fields-get-form/
  
    // Change 'form' to class or ID of your specific form
  $("form").submit(function() {
    $(this).find(":input").filter(function(){ return (!this.value || this.value == "default"); }).attr("disabled", "disabled");
    return true; // ensure form still submits
  });
  
  // Un-disable form fields when page loads, in case they click back after submission
  // PD Note: This doesn't work as intended. jQuery doesn't run after back button
  $( "form" ).find( ":input" ).prop( "disabled", false );

  var togglers = document.getElementsByClassName("toggles-others");
  var toggler_id;
  for (let i = 0; i < togglers.length; i++) {
    toggler_id = togglers[i].id;
    if (urlParams.has(toggler_id)) {
      document.getElementById(toggler_id).click();
    }
    toggleOthers(toggler_id);
  }
});

async function toggleOthers(toggler_id, toggled_ids=[]) {
  // Get the checkbox
  var checkBox = document.getElementById(toggler_id);
  const input_class = ".toggled-input-" + toggler_id;

  if (checkBox.checked == true && checkBox.disabled == false){
    $( "form" ).find(input_class).prop( "disabled", false );
  } else {
    $( "form" ).find(input_class).prop( "disabled", true );
  }

  // now recurse on inputs which are themselves togglers
  // avoid an infinite loop by adding this id to list of checked ones
  toggled_ids.push(toggler_id);
  var togglers = document.querySelectorAll(input_class+'.toggles-others');
  var toggler_id;
  for (let i = 0; i < togglers.length; i++) {
    toggler_id = togglers[i].id;
    if (!toggled_ids.includes(toggler_id)) {
      toggleOthers(toggler_id, toggled_ids);
    }
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
  "ancient",
  "greatwyrm"
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
  "white",
  "black"
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
  "White": [127, 128, 119],
  "Black": [0, 0, 0]
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

const index_of_cr_1 = 4; // prior to 1 are: 0, 1/8, 1/4, 1/2
const index_of_cr_30 = (30 - 1) + index_of_cr_1;
const max_cr = 50; // cr_table.csv extrapolates up to this hypothetical CR
const index_of_max_cr = (max_cr - 1) + index_of_cr_1;
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
// start of utilities
// copied from https://www.codegrepper.com/code-examples/javascript/convert+number+to+string+with+commas+javascript
function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function numberWithSign(x) {
  if (x < 0) {
    return x.toString();
  } else {
    return "+"+x.toString();
  }
}

function numberOrMin(x, min) {
  if (x < min) {
    return min;
  } else {
    return x;
  }
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
      if (header == "id" || header == "cr") {
        object[header.trim()] = values[index].trim();
      } else {
        object[header.trim()] = parseFloat(values[index]);
      }
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
      } else if (firstBrack == "monster") {
        contentsInURL = contents.toLowerCase();
        link = link + 'monsters/';
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
// end of utilities

// start of challenge rating calculation
function calculateDragonCr(dragon, verbose=false) {
  dragon.defensiveCr = calculateDragonDefensiveCr(dragon, verbose);
  dragon.offensiveCr = calculateDragonOffensiveCr(dragon, verbose);
  dragon.calculatedCr = averageCrs(dragon.defensiveCr, dragon.offensiveCr);
  if (verbose) { console.log("Calculated CR = " + dragon.calculatedCr); }
  return dragon;
}

function calculateDragonDefensiveCr(dragon, verbose=false) {
  let cr_out = -1;

  // Effective Armor Class
  let effective_ac = dragon.ac; // initialize as AC

  // Magic Resistance
  // Assume the dragon has Magic Resistance
  effective_ac += 2;

  // Saving Throw Proficiencies
  // Assume the dragon has 4 saving throw proficiencies
  effective_ac += 2; // 3-4 saving throw proficiencies (+4 if 5-6)

  if (effective_ac < 1) { effective_ac = 1; }
  if (verbose) { console.log("effective_ac = " + effective_ac); }
  //////////// Done calculating effective AC

  // Effective Hit Points
  let effective_hp = dragon.expectedHitPoints;

  // Frightful Presence: Increase the monster’s effective hit points by 25% if
  // the monster is meant to face characters of 10th level or lower.
  // Assume Nominal CR 17 is the max CR for characters of 10th level or lower.
  // Assume having Legendary Resistances means having Frightful Presence
  if (dragon.legendaryResistances > 0 && dragon.cr <= 17) {
    effective_hp += 0.25 * dragon.expectedHitPoints;
  }

  // Legendary Resistances
  // Each per-day use of this trait increases the monster’s effective
  // hit points based on the expected challenge rating:
  // 1–4, 10 hp; 5–10, 20 hp; 11 or higher, 30 hp.
  if (dragon.legendaryResistances > 0) {
    let hp_per_leg_resist = 30;
    if (dragon.cr <= 4) {
      hp_per_leg_resist = 10;
    } else if (dragon.cr <= 10) {
      hp_per_leg_resist = 20
    }
    effective_hp += hp_per_leg_resist * dragon.legendaryResistances;
  }

  if (effective_hp < 1) { effective_hp = 1; }
  if (verbose) { console.log("effective_hp = " + effective_hp); }
  //////////// Done calculating effective HP

  // Expected CR and AC from Effective HP
  const index_from_hp = crs.findIndex(object => {
    return (object.hpMin <= effective_hp && (object.hpMax + 1) > effective_hp);
  });
  if (index_from_hp >= 0 && index_from_hp <= index_of_max_cr) {
    const cr_from_hp = crs[index_from_hp].crNum;
    const ac_from_hp = crs[index_from_hp].ac;
    let cr_adjustment_from_ac = (effective_ac - ac_from_hp) / 2;
    if (cr_adjustment_from_ac > 0) {
      cr_adjustment_from_ac = Math.floor(cr_adjustment_from_ac);
    } else {
      cr_adjustment_from_ac = Math.ceil(cr_adjustment_from_ac);
    }
    cr_out = shiftCr(cr_from_hp, cr_adjustment_from_ac);
  }

  if (verbose) { console.log("defensive_cr = " + cr_out); }
  return cr_out;
}

function calculateDragonOffensiveCr(dragon, verbose=false) {
  let cr_out = -1;

  // Calculate expected damage per round
  // Breath Weapon: For the purpose of determining effective damage output,
  // assume the breath weapon hits two targets, and that each target fails
  // its saving throw.
  // If a monster’s damage output varies from round to round, calculate its
  // damage output each round for the first three rounds of combat, and take
  // the average. For example, a young white dragon has a multiattack routine
  // (one bite attack and two claw attacks) that deals an average of 37 damage
  // each round, as well as a breath weapon that deals 45 damage, or 90 if it
  // hits two targets (and it probably will). In the first three rounds of
  // combat, the dragon will probably get to use its breath weapon once and its
  // multiattack routine twice, so its average damage output for the first
  // three rounds would be (90 + 37 + 37) ÷ 3, or 54 damage (rounded down).
  let dmg_round1 = 2 * dragon.breath1ExpectedDamage;

  // Multiattack on rounds 2 and 3
  let dmg_round2 = dragon.biteExpectedDamage + dragon.biteElementExpectedDamage;
  if (dragon.age != "Wyrmling") {
    dmg_round2 += 2 * dragon.clawExpectedDamage;
  }
  let dmg_round3 = dmg_round2;

  // Legendary Action Damage
  let dmg_additional_atk = 0;
  let dmg_additional_dc = 0;
  // Assume having Legendary Resistances means having Legendary Actions
  if (dragon.legendaryResistances > 0) {
    dmg_additional_atk = dragon.tailExpectedDamage; // 1 Tail Attack
    dmg_additional_dc = dragon.wingAttackExpectedDamage; // 1 tgt failed save
  }

  let dmg_avg_round = (dmg_round1 + dmg_round2 + dmg_round3) / 3;
  dmg_avg_round += dmg_additional_atk + dmg_additional_dc;
  if (dmg_avg_round < 0) { dmg_avg_round = 0; }
  if (verbose) { console.log("dmg_avg_round = " + dmg_avg_round); }
  //////////// Done calculating average damage per round

  // Expected CR, Atk Bonus, and DC from damage
  const index_from_dmg = crs.findIndex(object => {
    return (object.dmgMin <= dmg_avg_round && (object.dmgMax + 1) > dmg_avg_round);
  });
  if (index_from_dmg >= 0 && index_from_dmg <= index_of_max_cr) {
    const cr_from_dmg = crs[index_from_dmg].crNum;
    const atk_from_dmg = crs[index_from_dmg].atk;
    const dc_from_dmg = crs[index_from_dmg].dc;
    
    let dmg_from_dc = (dmg_round1 / 3) + dmg_additional_dc;
    let dmg_from_atk = (dmg_round2 / 3) + (dmg_round3 / 3) + dmg_additional_atk;
    let overall_dc = ((dmg_round1 / 3) * dragon.saveDcCon + dmg_additional_dc * dragon.saveDcStr) / dmg_from_dc;
    let overall_atk = dragon.proficiencyStr;

    let cr_adjustment_from_dc = (overall_dc - dc_from_dmg) / 2;
    let cr_adjustment_from_atk = (overall_atk - atk_from_dmg) / 2;
    let cr_adjustment = (cr_adjustment_from_dc * dmg_from_dc + cr_adjustment_from_atk * dmg_from_atk) / (dmg_avg_round);
    cr_adjustment = Math.round(cr_adjustment);
    cr_out = shiftCr(cr_from_dmg, cr_adjustment);
  }

  if (verbose) { console.log("offensive_cr = " + cr_out); }
  return cr_out;
}

function averageCrs(cr_1, cr_2) {
  let cr_out = -1;

  // if either input is -1, our output should be -1 as well
  if (cr_1 >= 0 && cr_2 >= 0) {
    let index_1 = indexOfCr(cr_1);
    let index_2 = indexOfCr(cr_2);
    if (index_1 >= 0 && index_2 >= 0) {
      let mid_index = (index_1 + index_2) / 2;
      let half_shift = mid_index - Math.ceil(mid_index); // Should always be -0.5 or 0.0
      mid_index = Math.ceil(mid_index);
      cr_out = crByIndex(mid_index);
      if (cr_out <= 1 && half_shift < 0) {
        half_shift = -1 * cr_out / 4;
      }
      cr_out += half_shift;
    }
  }

  return cr_out;
}

function indexOfCr(cr) {
  let index_out = -1;

  if (cr >= 0 && cr <= max_cr) {
    if (cr > 0.9) {
      index_out = (cr - 1) + index_of_cr_1;
    } else if (cr > 0.4) {
      index_out = 3; // cr == 1/2
    } else if (cr > 0.2) {
      index_out = 2; // cr == 1/4
    } else if (cr > 0.1) {
      index_out = 1; // cr == 1/8
    } else {
      index_out = 0; // cr == 0
    }
  }

  return index_out;
}

function crByIndex(index) {
  let cr_out = -1;

  if (index >= 0 && index <= index_of_max_cr) {
    if (index >= index_of_cr_1) {
      cr_out = 1 + index - index_of_cr_1;
    } else if (index > 0) {
      cr_out = 1 / (2 ** (4 - index));
    } else {
      cr_out = 0; // index == 0
    }
  }

  return cr_out;
}

function shiftCr(cr, shift) {
  let cr_out = -1;

  let cr_index = indexOfCr(cr);
  if (cr_index >= 0) {
    cr_index += shift;
    if (cr_index < 0) { cr_index = 0; }
    if (cr_index > index_of_max_cr) { cr_index = index_of_max_cr; }
    cr_out = crByIndex(cr_index);
  }

  return cr_out;
}

function populateCrTable(row_name, dragon) {
  if (row_name == "default" || row_name == "customized") {
    document.getElementById("cr-" + row_name + "-nominal").innerHTML = "" + dragon.cr;
    document.getElementById("cr-" + row_name + "-calculated").innerHTML = "" + dragon.calculatedCr;
    document.getElementById("cr-" + row_name + "-offensive").innerHTML = "" + dragon.offensiveCr;
    document.getElementById("cr-" + row_name + "-defensive").innerHTML = "" + dragon.defensiveCr;
  }
}
// end of challenge rating calculation

function updateAncientToGreatwyrm(dragon) {
  // basics
  dragon.age = "Greatwyrm";
  dragon.cr = 28;
  dragon.numberOfHitDice = 30;
  dragon.strength = 30;
  dragon.constitution = 30;
  dragon.ac = 22;
  dragon.legendaryResistances = 4;

  // speeds
  dragon.walkingSpeed = 60;
  dragon.flyingSpeed = 120;
  for (let speed of ["burrowSpeed", "climbSpeed", "swimSpeed"]) {
    if (dragon[speed] > 0) {
      dragon[speed] = dragon.walkingSpeed;
    }
  }

  // condition immunities
  var conditions_arr = []
  if (dragon.conditionImmunities.length > 0) {
    conditions_arr = dragon.conditionImmunities.split(",");
  }
  for (let i = 0; i < conditions_arr.length; i++) {
    conditions_arr[i] = conditions_arr[i].trim().toLowerCase();
  }
  for (let condition of ["charmed", "frightened"]) {
    if (!conditions_arr.includes(condition)) {
      conditions_arr.push(condition);
    }
  }
  dragon.conditionImmunities = conditions_arr.sort().join(", ");

  // senses
  dragon.darkvision = 120; // should already be 120
  dragon.blindsight = dragon.darkvision;
  dragon.truesight = dragon.darkvision;

  // attacks
  dragon.biteDiceCount = 3;
  dragon.biteDiceType = 10; // should already be 10
  dragon.biteElementDiceCount = 4;
  dragon.biteElementDiceType = 6; // should already be 6
  dragon.clawDiceCount = 2; // should already be 2
  dragon.clawDiceType = 8;
  dragon.tailDiceCount = 2; // should already be 2
  dragon.tailDiceType = 10;
  // tail rider effect added later

  // breath weapon(s)
  dragon.breathConeSize = 300;
  dragon.breathLineLength = dragon.breathConeSize;
  dragon.breathLineWidth = 15;
  dragon.breath1DiceCount = 36;
  dragon.breath1DiceType = 6; // should already be 6

  // bonus actions
  dragon.prismaticRadianceRadius = 90;

  // legendary actions
  // (Tail Attack) becoming (Claw or Tail Attack) handled later
  dragon.wingAttackRadius = 30;
  dragon.wingAttackDiceCount = 3;
  dragon.wingAttackDiceType = 6; // should already be 6

  return dragon;
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
  if (dragon.age == "Greatwyrm") {
    dragon_name = "the greatwyrm";
  }
  dragon.usingDefaultName = true;
  if (urlParams.has("name") && urlParams.get("name")!="") {
    dragon_name = urlParams.get("name");
    dragon.usingDefaultName = false;
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
      dragon.doubleXp = numberWithCommas(2 * crs[i].xp);
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
      dragon[mod + "Sign"] = "-";
    } else {
      dragon[mod + "Sign"] = "+";
    }
    dragon[mod + "WithSign"] = numberWithSign(dragon[mod]);
    dragon[mod + "PlusTen"] = 10 + dragon[mod];
    Mod = capitalizeFirstLetter(mod);
    dragon["abs"+Mod] = Math.abs(dragon[mod]);
    dragon["proficiency"+Mod] = dragon.proficiencyBonus + dragon[mod];
    dragon["proficiency"+Mod+"WithSign"] = numberWithSign(dragon["proficiency"+Mod]);
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
  dragon.expectedHitPoints = numberOrMin(dragon.expectedHitPoints, 1);
  dragon.hpConMod = dragon.numberOfHitDice*dragon.con;
  if (dragon.hpConMod < 0) {
    dragon.hpConModSign = "-";
  } else {
    dragon.hpConModSign = "+";
  }
  dragon.absHpConMod = Math.abs(dragon.hpConMod);

  // Passive Skills
  dragon.passiveInsight = 10 + dragon.wis + dragon.skillInsight*dragon.proficiencyBonus;
  dragon.passiveInvestigation = 10 + dragon.int + dragon.skillInvestigation*dragon.proficiencyBonus;
  dragon.passivePerception = 10 + dragon.wis + dragon.skillPerception*dragon.proficiencyBonus;

  // Expected Damages
  dragon.biteExpectedDamage = Math.floor(dragon.biteDiceCount*(0.5+dragon.biteDiceType/2) + dragon.str);
  dragon.biteExpectedDamage = numberOrMin(dragon.biteExpectedDamage, 1);
  dragon.biteElementExpectedDamage = Math.floor(dragon.biteElementDiceCount*(0.5+dragon.biteElementDiceType/2));
  dragon.biteElementExpectedDamage = numberOrMin(dragon.biteElementExpectedDamage, 1);
  dragon.clawExpectedDamage = Math.floor(dragon.clawDiceCount*(0.5+dragon.clawDiceType/2) + dragon.str);
  dragon.clawExpectedDamage = numberOrMin(dragon.clawExpectedDamage, 1);
  dragon.tailExpectedDamage = Math.floor(dragon.tailDiceCount*(0.5+dragon.tailDiceType/2) + dragon.str);
  dragon.tailExpectedDamage = numberOrMin(dragon.tailExpectedDamage, 1);
  dragon.breath1ExpectedDamage = Math.floor(dragon.breath1DiceCount*(0.5+dragon.breath1DiceType/2));
  dragon.breath1ExpectedDamage = numberOrMin(dragon.breath1ExpectedDamage, 1);
  dragon.wingAttackExpectedDamage = Math.floor(dragon.wingAttackDiceCount*(0.5+dragon.wingAttackDiceType/2) + dragon.str);
  dragon.wingAttackExpectedDamage = numberOrMin(dragon.wingAttackExpectedDamage, 1);

  return dragon;
}

function addGeneralDragonStatistics(dragon) {
  // Dragon Title
  let dragon_descriptive_title = "";
  if (dragon.age == "Wyrmling") {
    dragon_descriptive_title = "" + dragon.color + " Dragon " + dragon.age;
  } else if (dragon.age == "Greatwyrm") {
    dragon_descriptive_title = "" + dragon.color + " " + dragon.age;
  } else {
    dragon_descriptive_title = "" + dragon.age + " " + dragon.color + " Dragon";
  }
  var title_for_screen_arr = [];
  if (dragon.usingDefaultName) {
    dragon.dragonTitle = dragon_descriptive_title;
  } else {
    dragon.dragonTitle = dragon.theDragonNameUpper + " (" + dragon_descriptive_title + ")";
    title_for_screen_arr.push(dragon.theDragonNameUpper);
  }
  title_for_screen_arr.push(dragon_descriptive_title);
  title_for_screen_arr.push("Prismatic Dragon Generator");
  dragon.dragonTitleForScreen = title_for_screen_arr.join(" - ");

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
  dragon.savingThrows = "DEX " + numberWithSign(dragon.proficiencyDex) +
                        ", CON " + numberWithSign(dragon.proficiencyCon) +
                        ", WIS " + numberWithSign(dragon.proficiencyWis) +
                        ", CHA " + numberWithSign(dragon.proficiencyCha);

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
      skill_mod = Math.floor(dragon[global_skills[i].ability] +
                             skill_prof*dragon.proficiencyBonus);
      if (skill_mod < 0) {
        skill_sign = "-";
      } else {
        skill_sign = "+";
      }
      skills_arr.push(global_skills[i].skill + " " + numberWithSign(skill_mod));
    }
  }
  for (let i = 0; i < skills_arr.length; i++) {
    skills_arr[i] = "<span class=\"nowrap\">" + skills_arr[i] + "</span>";
  }
  dragon.skills = skills_arr.join(", ");

  // Cantrip(s)
  const spell_prefix = "<i>[spell]";
  const spell_suffix = "[/spell]</i>";
  if (dragon.rawCantrip.length > 0) {
    // copied from https://stackoverflow.com/a/9030062
    let cantrips_arr = dragon.rawCantrip.split(/,(?![^(]*\))/g);
    dragon.numberOfAtWillSpells = cantrips_arr.length;
    var cantrip_arr;
    var cantrip;
    var parenthetical;
    for (let i = 0; i < cantrips_arr.length; i++) {
      cantrip_arr = cantrips_arr[i].split("(");
      cantrip = cantrip_arr[0].trim();
      if (cantrip_arr.length > 1) {
        parenthetical = " (" + cantrip_arr[1].trim();
      } else {
        parenthetical = "";
      }
      cantrips_arr[i] = spell_prefix + cantrip + spell_suffix + parenthetical;
    }
    dragon.cantrip = cantrips_arr.sort().join(", ");
  } else {
    dragon.numberOfAtWillSpells = 0;
    dragon.cantrip = "";
  }

  // Spell(s)
  if (dragon.rawSpells.length > 0) {
    let spells_arr = dragon.rawSpells.split(/,(?![^(]*\))/g);
    dragon.numberOfOncePerDaySpells = spells_arr.length;
    var spell_arr;
    var spell;
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
  } else {
    dragon.numberOfOncePerDaySpells = 0;
    dragon.spells = "";
  }

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

  // Innate Spellcasting
  var disable_leveled_spells = false;
  var disable_cantrip = false;
  var disable_all_spellcasting = false;
  if (urlParams.has("spellstate")) {
    if (urlParams.get("spellstate") == "onlyatwill") {
      disable_leveled_spells = true;
      document.getElementById("spellstate").value = "onlyatwill";
    } else if (urlParams.get("spellstate") == "noatwill") {
      disable_cantrip = true;
      document.getElementById("spellstate").value = "noatwill";
    } else if (urlParams.get("spellstate") == "off") {
      disable_all_spellcasting = true;
      document.getElementById("spellstate").value = "off";
    }
  }
  if (dragon.numberOfAtWillSpells === 0) {
    disable_cantrip = true;
  }
  if (dragon.numberOfOncePerDaySpells === 0) {
    disable_leveled_spells = true;
  }
  if (disable_cantrip && disable_leveled_spells) {
    disable_all_spellcasting = true;
  }
  var default_description = true;
  if (urlParams.has("spelldescription")) {
    if (urlParams.get("spelldescription") == "neither") {
      default_description = false;
      dragon.cantripDcString = "";
      dragon.spellsDcString = dragon.cantripDcString;
      document.getElementById("spelldescription").value = "neither";
    } else if (urlParams.get("spelldescription") == "attack") {
      default_description = false;
      dragon.cantripDcString = " (" + numberWithSign(dragon.proficiencyCha) + " to hit with spell attacks)";
      dragon.spellsDcString = dragon.cantripDcString;
      document.getElementById("spelldescription").value = "attack";
    } else if (urlParams.get("spelldescription") == "dc") {
      default_description = false;
      dragon.cantripDcString = " (spell save DC " + dragon.saveDcCha + ")";
      dragon.spellsDcString = dragon.cantripDcString;
      document.getElementById("spelldescription").value = "dc";
    } else if (urlParams.get("spelldescription") == "both") {
      default_description = false;
      dragon.cantripDcString = " (spell save DC " + dragon.saveDcCha + ", " + numberWithSign(dragon.proficiencyCha) + " to hit with spell attacks)";
      dragon.spellsDcString = dragon.cantripDcString;
      document.getElementById("spelldescription").value = "both";
    }
  }
  if (default_description) {
    var include_atk = false;
    var include_dc = false;
    if (!disable_cantrip && dragon.atWillSpellsHaveAttack > 0) {
      include_atk = true;
    }
    if (!disable_cantrip && dragon.atWillSpellsHaveSave > 0) {
      include_dc = true;
    }
    if (!disable_leveled_spells && dragon.oncePerDaySpellsHaveAttack > 0) {
      include_atk = true;
    }
    if (!disable_leveled_spells && dragon.oncePerDaySpellsHaveSave > 0) {
      include_dc = true;
    }
    var desc_string = "";
    if (include_atk || include_dc) {
      desc_string = desc_string + " (";
    }
    if (include_dc) {
      desc_string = desc_string + "spell save DC " + dragon.saveDcCha;
    }
    if (include_atk && include_dc) {
      desc_string = desc_string + ", ";
    }
    if (include_atk) {
      desc_string = desc_string + numberWithSign(dragon.proficiencyCha) + " to hit with spell attacks";
    }
    if (include_atk || include_dc) {
      desc_string = desc_string + ")";
    }
    dragon.spellsDcString = desc_string;
  }
  if (!disable_all_spellcasting) {
    var number_of_spells = 0;
    if (!disable_cantrip) {
      number_of_spells = number_of_spells + dragon.numberOfAtWillSpells;
    }
    if (!disable_leveled_spells) {
      number_of_spells = number_of_spells + dragon.numberOfOncePerDaySpells;
      if (dragon.numberOfOncePerDaySpells > 1) {
        dragon.onceEach = " each";
      } else {
        dragon.onceEach = "";
      }
    }
    if (number_of_spells > 1) {
      dragon.spellOrSpells = "s";
    } else {
      dragon.spellOrSpells = "";
    }
    out_arr.push(insertVariablesToTemplate_(templates.innateSpellcastingDescriptionAdult, dragon));
    if (!disable_cantrip) {
      out_arr.push(insertVariablesToTemplate_(templates.innateSpellcastingCantrip, dragon));
    }
    if (!disable_leveled_spells) {
      out_arr.push(insertVariablesToTemplate_(templates.innateSpellcastingSpells, dragon));
    }
  }

  if (dragon.legendaryResistances > 0) {
    out_arr.push(insertVariablesToTemplate_(templates.legendaryResistance, dragon));
  }

  out_arr.push(insertVariablesToTemplate_(templates.magicResistance, dragon));

  if (dragon.legendaryResistances > 0) {
    out_arr.push(insertVariablesToTemplate_(templates.magicWeapons, dragon));
  }

  if (dragon.age == "Greatwyrm") {
    out_arr.push(insertVariablesToTemplate_(templates.prismaticAwakening, dragon));
  }

  if (urlParams.has("usealtvulnerability")) {
    let features_lost = "Innate Spellcasting, Magic Resistance, ";
    if (urlParams.has("nowallofcolor") || !((dragon.age == "Adult" || dragon.age == "Ancient" || dragon.age == "Greatwyrm") && dragon.color != "White" && dragon.color != "Black")) {
      if (dragon.color == "Black") {
        features_lost = features_lost + "and Diminish Light";
      } else {
        features_lost = features_lost + "and Variable Radiance";
      }
    } else {
      features_lost = features_lost + "Variable Radiance, and Wall of Prismatic " + dragon.colorUpper;
    }
    dragon.altVulnerabilityFeaturesLost = features_lost;
    out_arr.push(insertVariablesToTemplate_(templates["altVulnerability" + dragon.color], dragon));
    // populate form
    document.getElementById("usealtvulnerability").checked = true;
  }

  if (dragon.age == "Greatwyrm") {
    out_arr.push(insertVariablesToTemplate_(templates.unusualNature, dragon));
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
if (dragon.biteElementExpectedDamage > 0) {
  out_arr.push(insertVariablesToTemplate_(templates.bite, dragon));
} else {
  out_arr.push(insertVariablesToTemplate_(templates.biteNoElement, dragon));
}
if (dragon.clawReach > 0) {
  if (dragon.age == "Greatwyrm") {
    dragon.clawRider = insertVariablesToTemplate_(templates.clawRiderForGreatwyrm, dragon);
  }
  out_arr.push(insertVariablesToTemplate_(templates.claw, dragon));
}
if (dragon.tailReach > 0) {
  if (dragon.age == "Greatwyrm") {
    dragon.tailRider = insertVariablesToTemplate_(templates.tailRiderForGreatwyrm, dragon);
  }
  out_arr.push(insertVariablesToTemplate_(templates.tail, dragon));
}
if (dragon.age == "Adult" || dragon.age == "Ancient" || dragon.age == "Greatwyrm") {
  out_arr.push(insertVariablesToTemplate_(templates.frightfulPresence, dragon));
}

// Breath Weapons
let breathColor = "breath" + dragon.colorUpper;
let has_second_breath = true;
if (dragon.age == "Wyrmling") {
  has_second_breath = false; // disabled for Wyrmlings by default
}
if (urlParams.has("secondbreath")) {
  if (urlParams.get("secondbreath") == "on") {
    has_second_breath = true;
    document.getElementById("secondbreath").value = "on";
  } else if (urlParams.get("secondbreath") == "off") {
    has_second_breath = false;
    document.getElementById("secondbreath").value = "off";
  }
}
// if (urlParams.has("nosecondbreath")) {
//   has_second_breath = false;
//   document.getElementById("nosecondbreath").checked=true;
// }
if (has_second_breath) {
  out_arr.push(insertVariablesToTemplate_(templates[breathColor + "1"], dragon));
  if (dragon.color != "Violet") {
    out_arr.push(insertVariablesToTemplate_(templates[breathColor + "2"], dragon));
  } else {
    let breathStart = insertVariablesToTemplate_(templates[breathColor + "2"], dragon);
    let breathEnd;
    if (dragon.age == "Adult" || dragon.age == "Ancient" || dragon.age == "Greatwyrm") {
      breathEnd = insertVariablesToTemplate_(templates[breathColor + "2EndAdult"], dragon)
    } else {
      breathEnd = insertVariablesToTemplate_(templates[breathColor + "2EndYoung"], dragon)
    }
    out_arr.push(breathStart + breathEnd);
  }
} else {
  out_arr.push(insertVariablesToTemplate_(templates[breathColor + "Wyrmling"], dragon));
}

// Wall of Prismatic Color
if (urlParams.has("nowallofcolor")) {
  // no wall of color
  // populate form to reflect no wall of color
  document.getElementById("nowallofcolor").checked=true;
} else if ((dragon.age == "Adult" || dragon.age == "Ancient" || dragon.age == "Greatwyrm") && dragon.color != "White" && dragon.color != "Black") {
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
} else if (dragon.age == "Adult" || dragon.age == "Ancient" || dragon.age == "Greatwyrm") {
  out_arr.push(insertVariablesToTemplate_(templates.changeShape, dragon));
}

if (dragon.color == "Black") {
  out_arr.push(insertVariablesToTemplate_(templates.diminishLight, dragon));
} else {
  out_arr.push(insertVariablesToTemplate_(templates.prismaticRadiance, dragon));
}


return out_arr;
}
// end of main library

function returnDragon(dragon_color, dragon_age, override_vals={}) {
  // find base dragon values for this color and age
  var dragon_key = normalizeHeader_(dragon_color + " " + dragon_age);
  if (dragon_age == "Greatwyrm") {
    // greatwyrms are based on the ancient values
    dragon_key = normalizeHeader_(dragon_color + " Ancient");
  }
  var dragon = dragons[dragon_key];

  if (dragon_age == "Greatwyrm") {
    // update ancient values to greatwyrm values
    dragon = updateAncientToGreatwyrm(dragon);
  }

  // override with provided values
  for (const key in override_vals) {
    dragon[key] = override_vals[key];
  }

  // add the other dragon values needed
  dragon = addUserSpecifiedValues(dragon);
  dragon = addBackendCalculatedValues(dragon);
  dragon = addGeneralDragonStatistics(dragon);
  dragon = addCaseVariants(dragon);
  dragon = calculateDragonCr(dragon, false);
  return dragon;
}

function returnOverrideVals() {
  var override_vals = {};

  if (urlParams.has("strength")) {
    let ability_override = urlParams.get("strength");
    if (ability_override >= 1 && ability_override <= 30) {
      override_vals.strength = Math.round(ability_override);
      document.getElementById("strength").value = ability_override;
    }
  }
  if (urlParams.has("dexterity")) {
    let ability_override = urlParams.get("dexterity");
    if (ability_override >= 1 && ability_override <= 30) {
      override_vals.dexterity = Math.round(ability_override);
      document.getElementById("dexterity").value = ability_override;
    }
  }
  if (urlParams.has("constitution")) {
    let ability_override = urlParams.get("constitution");
    if (ability_override >= 1 && ability_override <= 30) {
      override_vals.constitution = Math.round(ability_override);
      document.getElementById("constitution").value = ability_override;
    }
  }
  if (urlParams.has("intelligence")) {
    let ability_override = urlParams.get("intelligence");
    if (ability_override >= 1 && ability_override <= 30) {
      override_vals.intelligence = Math.round(ability_override);
      document.getElementById("intelligence").value = ability_override;
    }
  }
  if (urlParams.has("wisdom")) {
    let ability_override = urlParams.get("wisdom");
    if (ability_override >= 1 && ability_override <= 30) {
      override_vals.wisdom = Math.round(ability_override);
      document.getElementById("wisdom").value = ability_override;
    }
  }
  if (urlParams.has("charisma")) {
    let ability_override = urlParams.get("charisma");
    if (ability_override >= 1 && ability_override <= 30) {
      override_vals.charisma = Math.round(ability_override);
      document.getElementById("charisma").value = ability_override;
    }
  }

  let skill_key = "";
  let skill_level = 0.0;
  for (let i = 0; i < global_skills.length; i++) {
    skill_key = normalizeHeader_("Skill " + global_skills[i].skill);
    if (urlParams.has(skill_key)) {
      skill_level = parseFloat(urlParams.get(skill_key));
      if (skill_level === 0.0 || skill_level === 0.5 || skill_level === 1.0 || skill_level === 2.0) {
        override_vals[skill_key] = skill_level;
        document.getElementById(skill_key).value = "" + skill_level.toFixed(1);
      }
    }
  }

  if (urlParams.has("cr-override")) {
    let cr_override = urlParams.get("cr-override");
    if (cr_override >= 1 && cr_override <= 30) {
      override_vals.cr = Math.round(cr_override);
      document.getElementById("cr-override").value = cr_override;
    }
  }

  if (urlParams.has("breath1dCount")) {
    let breath1dCount = urlParams.get("breath1dCount");
    if (breath1dCount >= 1 && breath1dCount <= 64) {
      override_vals.breath1DiceCount = Math.round(breath1dCount);
      document.getElementById("breath1dCount").value = breath1dCount;
    }
  }

  if (urlParams.has("breath1dType")) {
    let breath1dType = urlParams.get("breath1dType");
    // default == 6
    if (breath1dType == 4 || breath1dType == 8 || breath1dType == 10 || breath1dType == 12 || breath1dType == 20) {
      override_vals.breath1DiceType = parseInt(breath1dType);
      document.getElementById("breath1dType").value = breath1dType;
    }
  }

  if (urlParams.has("cantripoverride")) {
    let cantrip_override = urlParams.get("cantripoverride");
    if (cantrip_override.length > 0) {
      override_vals.rawCantrip = cantrip_override;
      document.getElementById("cantripoverride").value = cantrip_override;
    }
  }

  if (urlParams.has("spellsoverride")) {
    let spells_override = urlParams.get("spellsoverride");
    if (spells_override.length > 0) {
      override_vals.rawSpells = spells_override;
      document.getElementById("spellsoverride").value = spells_override;
    }
  }

  return override_vals;
}

async function transitionFromLoadingToDragon(transition_mode=0) {
  // smoothly transition from loading to dragon stat block
  // mode 0 = default behavior, nothing special
  // mode 1 = open the menu after everything else has transitioned
  // mode 2 = remove the menu as part of this transition
  const loading_animation = document.getElementById("loading-animation-div")
  const menu_div = document.getElementById("dragon-options-menu-div");
  const dragon_div = document.getElementById("dragon-destination");
  dragon_div.style.opacity = '0';
  if (transition_mode == 2) {
    menu_div.style.opacity = '0';
  }
  loading_animation.style.opacity = '0';
  loading_animation.addEventListener('transitionend', () => {
    loading_animation.remove();
    if (transition_mode == 2) {
      menu_div.style.display = 'none';
    }
    document.getElementById("release-the-dragon").click();
    dragon_div.style.opacity = '1';
    if (transition_mode == 1) {
      dragon_div.addEventListener('transitionend', () => {
        document.getElementById("dragon-menu-btn").click();
      });
    }
  });
}

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
  var dragon_age = "Wyrmling";
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
  var dragon = returnDragon(dragon_color, dragon_age);
  const default_dragon = dragon;
  populateCrTable("default", default_dragon);
  populateCrTable("customized", default_dragon);

  const override_vals = returnOverrideVals();
  if (!jQuery.isEmptyObject(override_vals)) {
    dragon = returnDragon(dragon_color, dragon_age, override_vals);
    populateCrTable("customized", dragon);
  }

  // update the page title
  document.title = dragon.dragonTitleForScreen;

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
  if (dragon.age == "Adult") {
    out_arr.push(insertVariablesToTemplate_(templates.htmlMonsterStatResistances, dragon));
  }
  out_arr.push(insertVariablesToTemplate_(templates.htmlMonsterStatImmunities, dragon));
  if (dragon.conditionImmunities.length > 0) {
    out_arr.push(insertVariablesToTemplate_(templates.htmlMonsterStatConditionImmunities, dragon));
  }
  if (dragon.truesight > 0) {
    dragon.htmlTruesight = insertVariablesToTemplate_(templates["htmlMonsterTruesight"], dragon);
  }
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
    if (dragon.age == "Greatwyrm") {
      out_arr.push(insertVariablesToTemplate_(templates.legendaryGreatwyrmAttack, dragon));
    } else {
      out_arr.push(insertVariablesToTemplate_(templates.legendaryTailAttack, dragon));
    }
    out_arr.push(insertVariablesToTemplate_(templates.legendaryWingAttack, dragon));
  }

  if (dragon.age == "Greatwyrm") {
    out_arr.push(insertVariablesToTemplate_(templates.htmlTitleMythicActions, dragon));
    out_arr.push(insertVariablesToTemplate_(templates.mythicDescription, dragon));
    out_arr.push(insertVariablesToTemplate_(templates.mythicBite, dragon));
    if (dragon.color == "Black") {
      out_arr.push(insertVariablesToTemplate_(templates.mythicNovaBlack, dragon));
    } else {
      out_arr.push(insertVariablesToTemplate_(templates.mythicNova, dragon));
    }
  }

  out_arr.push(insertVariablesToTemplate_(templates.htmlMonsterEnd, dragon));
  var output = out_arr.join("\n");
  output = convertTagsToLinks_(output);
  document.getElementById("dragon-destination").innerHTML = output;
  // end of dragon statblock generation

  // change stat block colors to match dragon color (or custom input)
  let new_theme = css_color_themes[dragon_color];
  if (urlParams.has("usecustomtheme")) {
    document.getElementById("usecustomtheme").checked=true;
    if (urlParams.has("theme-r") && urlParams.has("theme-g") && urlParams.has("theme-b")) {
      let thm_in_r = urlParams.get("theme-r");
      let thm_in_g = urlParams.get("theme-g");
      let thm_in_b = urlParams.get("theme-b");
      if ((thm_in_r >= 0 && thm_in_r <= 255) &&
          (thm_in_g >= 0 && thm_in_g <= 255) &&
          (thm_in_b >= 0 && thm_in_b <= 255)) {
        new_theme[0] = parseInt(thm_in_r);
        new_theme[1] = parseInt(thm_in_g);
        new_theme[2] = parseInt(thm_in_b);
      }
    }
  }
  setMonstersColor(new_theme[0], new_theme[1], new_theme[2]);
  document.getElementById("theme-r").value = new_theme[0];
  document.getElementById("theme-g").value = new_theme[1];
  document.getElementById("theme-b").value = new_theme[2];

  // modify grammatical tense for singular they
  if (dragon.itshe == "they") {
    var affected_spans = document.getElementsByClassName("affected-by-they");
    for (let i = 0; i < affected_spans.length; i++) {
      let affected_span = affected_spans[i];
      affected_span.innerHTML = affected_span.getAttribute("data-they");
    }
  }

  let transition_mode = 0;
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
    transition_mode = 2;
  }
  transitionFromLoadingToDragon(transition_mode);

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
  if (urlParams.has("ignorecache")) {
    request.setRequestHeader("Cache-Control", "no-cache, no-store, max-age=0");
  }
  request.send(null);
  request.onreadystatechange = function() {
    if ( request.readyState === 4 && request.status === 200 ) {
      dragons = JSON.parse(request.responseText);
      // console.log(dragons);
      importTemplates();
    }
  }
}

function importTemplates() {
  var request = new XMLHttpRequest();
  request.open("GET", "data/feature_templates.json", true);
  if (urlParams.has("ignorecache")) {
    request.setRequestHeader("Cache-Control", "no-cache, no-store, max-age=0");
  }
  request.send(null);
  request.onreadystatechange = function() {
    if ( request.readyState === 4 && request.status === 200 ) {
      templates = JSON.parse(request.responseText);
      // console.log(templates);
      importCrs();
    }
  }
}

function importCrs() {
  var request = new XMLHttpRequest();
  request.open("GET", "data/cr_table.csv", true);
  if (urlParams.has("ignorecache")) {
    request.setRequestHeader("Cache-Control", "no-cache, no-store, max-age=0");
  }
  request.send(null);
  request.onreadystatechange = function() {
    if ( request.readyState === 4 && request.status === 200 ) {
      crs = csvToArray(request.responseText);
      // console.log(crs);
      generateDragon();
    }
  }
}

function importHome() {
  var request = new XMLHttpRequest();
  request.open("GET", "home_insert.html", true);
  if (urlParams.has("ignorecache")) {
    request.setRequestHeader("Cache-Control", "no-cache, no-store, max-age=0");
  }
  request.send(null);
  request.onreadystatechange = async function() {
    if ( request.readyState === 4 && request.status === 200 ) {
      var parser = new DOMParser();
      var home_insert = parser.parseFromString(request.responseText, 'text/html');
      document.getElementById("dragon-destination").innerHTML = home_insert.getElementById("help-text-to-insert").innerHTML;
      await transitionFromLoadingToDragon(1);
    }
  }
}

function decideLoadPath() {
  if (urlParams.has("ignorecache")) {
    document.getElementById("ignorecache").value = "on";
  }
  if (urlParams.has("color") || urlParams.has("age")) {
    importDragons(); // import then generate the dragon
  } else if (urlParams.has("loadendlessly")) {
    // pass, just load endlessly
  } else {
    importHome(); // show the home page help text
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function rollDie(sides = 6) {
  return (1 + Math.floor(Math.random() * sides));
}

async function delayLoad() {
  const d20_result = rollDie(20);
  console.log(d20_result);
  await sleep(d20_result * 50);
  decideLoadPath();
}

delayLoad();