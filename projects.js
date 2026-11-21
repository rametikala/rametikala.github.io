// Add a project = add an object. Home page and article pages are generated from this list.
// Rule: every "measured" value stays "—" until a flight/test log exists in the repo.
const GH = "https://github.com/rametikala";
const PROJECTS = [
{
 slug:"mapping-drone", feature:true, status:"In progress",
 title:"Can a Village-Scale Mapping Drone Hit Survey-Grade Accuracy?",
 dek:"A public build log of a low-cost mapping drone: requirements, decisions, test data and failures.",
 topics:["Aerospace","Geospatial"], type:"Feature", date:"2026-11-21", read:"6 min read",
 caption:"Placeholder hero. Replace with a photo of your airframe or an orthomosaic.",
 stats:[["Ground sample distance (GSD)","__ cm/px","—","Not flown"],["RMSE X / Y / Z","__ / __ / __ cm","—","Not flown"],["Endurance","__ min","—","Not flown"],["Cost per sq km mapped","__ USD","—","No data"]],
 sections:[
  ["The problem","Survey-grade drone kits cost more than many small organisations can spend. State who is priced out, what they use instead, and what that costs them in time or accuracy. Link your interview notes."],
  ["Requirements","List the requirements with IDs and pass/fail limits, for example R-01: absolute horizontal error under X cm on checkpoints. A requirement without a number is a wish."],
  ["Key decisions","One short paragraph per decision: options, the trade-off, who decided, and what would make you reverse it. Link each to its file in 03-decisions."],
  ["What has been tested","Nothing has been flown yet. When it has, each result goes here with its raw log and processing settings."],
  ["What went wrong","Failures go here with root cause and fix. An empty section is better than an invented one."]],
 links:[["Repository",GH+"/mapping-drone"],["Requirements",GH+"/mapping-drone/tree/main/02-requirements"],["Decision log",GH+"/mapping-drone/tree/main/03-decisions"],["Validation data",GH+"/mapping-drone/tree/main/07-validation"]]
},
{
 slug:"strike-dip-device", status:"Prototype",
 title:"A One-Click Strike and Dip Instrument With Built-In GPS",
 dek:"A self-funded field device for geologists. Two prototypes built; market validation is next.",
 topics:["Hardware","Geospatial"], type:"Project", date:"2026-11-20", read:"4 min read",
 caption:"Placeholder. Replace with a photo of the prototype in the field.",
 stats:[["Field test with an NGO team","Planned","—","Not run"],["Go / quit decision","Criteria to define","—","Open"]],
 sections:[["The problem","Describe how strike, dip and position are recorded today and where it is slow or error-prone."],["What exists","Two prototypes. Describe what each does, what changed between them and why."],["Next step","State the validation test, the number of users, and the result that would make you continue or stop."]],
 links:[["Repository",GH+"/strike-dip-device"]]
},
{
 slug:"springshed-analysis", status:"Working",
 title:"Mapping Vegetation Decline to Decide Where Springs Need Help",
 dek:"Multi-year Sentinel-2 NDVI and NDWI analysis to plan springshed interventions such as planting.",
 topics:["Geospatial","Climate Tech"], type:"Case study", date:"2026-09-11", read:"5 min read",
 caption:"Placeholder. Replace with a before/after NDVI map. Check publication rights first.",
 stats:[["Years analysed","Add","—","Add"],["Area of interest","Add","—","Add"]],
 sections:[["The question","Which parts of a springshed lost vegetation, and where would intervention help most?"],["Method","Sentinel-2 imagery from the Planetary Computer, clipped to a KML boundary, with NDVI and NDWI compared across years."],["Limits","State cloud cover, season matching, and what the data cannot prove. Publish only data you have written clearance for."]],
 links:[["Repository",GH+"/springshed-analysis"]]
},
{
 slug:"wildlife-tracker", status:"Hackathon",
 title:"A Low-Weight, Low-Cost Wildlife Tracker for Forest Departments",
 dek:"Entry in the Gujarat SpaceTech Hackathon 2026, challenge GSH-FED-01.",
 topics:["Hardware","Aerospace"], type:"Project", date:"2026-11-21", read:"3 min read",
 caption:"Placeholder. Replace with a block diagram or bench photo.",
 stats:[["Mass","__ g","—","No data"],["Unit cost","__ USD","—","No data"],["Battery life","__ days","—","No data"]],
 sections:[["The challenge","Summarise the Forests and Environment Department requirement in two sentences."],["Approach","State the architecture and the trade-offs between weight, power and cost."],["Results","Add only measured values."]],
 links:[["Repository",GH+"/wildlife-tracker"]]
}];
const esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const fmt=d=>new Date(d+"T00:00:00Z").toLocaleDateString("en-GB",{day:"2-digit",month:"short",year:"numeric",timeZone:"UTC"});
const chips=p=>`<div class="chips">${p.topics.map(t=>`<span class="chip topic">${esc(t)}</span>`).join("")}<span class="chip">${esc(p.type)}</span></div>`;
const href=p=>`project.html#${p.slug}`;
