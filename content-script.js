import {createClient} from "@supabase/supabase-js";

const supabase = createClient(
    "https://usdzgcdcgeedghkhrchw.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVzZHpnY2RjZ2VlZGdoa2hyY2h3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY5NTEwMTYsImV4cCI6MjA3MjUyNzAxNn0.YYj7WqIouVoczfKpMQdR34m4Hhhy59JhJNnA7TFT7CU"
);

let schnInjected = false;

function injectSimplifiedChinese() {
  // don't run again if already ran on the page only if the page IS reset
  if (schnInjected) return;
  schnInjected = true;
  //

  // if we are on /sets/schn, delete the "not found" and inject our new page
  if (window.location.pathname === "/sets/schn") {
    const notFound = document.querySelector("#page-header");
    if (notFound) notFound.remove();

    const notFound2 = document.querySelector("#page-content .container");
    if (notFound2) notFound2.remove();

    const notFound3 = document.querySelector("#page-content");

    const stylesheetSetPage = document.createElement("link");
    stylesheetSetPage.rel = "stylesheet";
    stylesheetSetPage.href = "https://static.tcgcollector.com/build/css/page.sets.sets.d26a8807.css";

    if (!document.querySelector(`link[href="${stylesheetSetPage.href}"]`)) { // avoid duplicates
      document.head.appendChild(stylesheetSetPage);
      console.log(`Set Page Stylesheet injected: ${stylesheetSetPage.href} ✅`);
    }

    if (notFound3) {
      notFound3.innerHTML = `
  <div class="container">

    <div id="tcg-region-links-button-group-container">

      <div id="tcg-region-links-button-group" class="button-group ">

        <a href="/sets/intl?setMode=allCardVariants&amp;releaseDateOrder=newToOld&amp;displayAs=logos" class="
        tcg-region-links-button-group-link
        button
        button-plain-alt
              " data-tcg-region-id="1" data-link-visitor-disabled="">
          International
        </a>
        <a href="/sets/jp?setMode=allCardVariants&amp;releaseDateOrder=newToOld&amp;displayAs=logos" class="
        tcg-region-links-button-group-link
        button
        button-plain-alt
              " data-tcg-region-id="2" data-link-visitor-disabled="">
          Japan
        </a></div>

      <div id="sets-page-buttons">

        <button type="button" title="Share my collection" aria-label="Share my collection" class="
              card-collection-share-button
              button
              button-plain-alt
              button-with-icon-only
            " fdprocessedid="s9txl">
          <span aria-hidden="true" class="button-icon fa-solid fa-share-nodes fa-fw"></span>
        </button>

        <button type="button" title="Change my preferences" aria-label="Change my preferences" id="sets-page-preferences-drawer-show-button" class="button button-plain-alt button-with-icon-only" fdprocessedid="46k1j2">
          <span aria-hidden="true" class="button-icon fa-solid fa-gear fa-fw"></span>
        </button>

      </div>

    </div>

    <div id="sets-page-actions">

      <div id="set-search-form-control-container" class="form-control-container">

        <span aria-hidden="true" class="form-control-icon fa-solid fa-magnifying-glass"></span>

        <button type="button" class="
            form-control-clear-button
                      " tabindex="-1">
        </button>

        <input type="search" id="set-search-form-control" name="setSearch" class="form-control" value="" placeholder="Search sets..." autocomplete="off" size="25">

      </div>

      <div id="set-source-radios-container">

        <div id="set-source-radios">

          <div class="radio set-source-radio">

            <input type="radio" id="radio-input-13582569" name="setSource" class="radio-input" value="all" checked="">

            <label for="radio-input-13582569" class="radio-label">
              <span aria-hidden="true" class="radio-indicator"></span>
              All
            </label>

          </div>

          <div class="radio set-source-radio">

            <input type="radio" id="radio-input-186843698" name="setSource" class="radio-input" value="cardCollectionInProgress">

            <label for="radio-input-186843698" class="radio-label">
              <span aria-hidden="true" class="radio-indicator"></span>
              In progress
            </label>

          </div>

          <div class="radio set-source-radio">

            <input type="radio" id="radio-input-555182996" name="setSource" class="radio-input" value="cardCollectionCompleted">

            <label for="radio-input-555182996" class="radio-label">
              <span aria-hidden="true" class="radio-indicator"></span>
              Completed
            </label>

          </div>
        </div>

        <div id="set-mode-dropdown-container">

          <label>Show sets as</label>

          <button type="button" class="
        dropdown-toggle
        button button-link-like-alt      " data-toggle="dropdown" data-target="#set-mode-dropdown" fdprocessedid="982zng">
            <span aria-hidden="true" class="dropdown-toggle-caret"></span>
            All card variants
          </button>

          <div id="set-mode-dropdown" class="
    dropdown
          dropdown-selectable
          " data-toggle-text-separator=", " data-query-string-key="setMode">

            <div class="dropdown-menu">

              <div class="dropdown-menu-content">

                <div class="dropdown-option " tabindex="0" data-value="anyCardVariant">
                  Any card variant
                </div>

                <div class="dropdown-option " tabindex="0" data-value="regularCardVariants">
                  Regular card variants
                </div>

                <div class="dropdown-option selected" tabindex="0" data-value="allCardVariants">
                  All card variants
                </div>

                <div class="dropdown-divider"></div>

                <div class="dropdown-option " tabindex="0" data-value="standardSet">
                  Standard set
                </div>

                <div class="dropdown-option " tabindex="0" data-value="parallelSet">
                  Parallel set
                </div>

                <div class="dropdown-divider"></div>

                <a href="/account/settings/card-collection" class="dropdown-option">
                    <span class="dropdown-option-left-item-container">
                        <span aria-hidden="true" class="dropdown-option-side-item-icon fa-solid fa-gear fa-fw">
                        </span>
                    </span>
                  Change progress settings
                </a>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>

  </div>


  <div id="set-search-result" class="
        set-sort-by-expansion-series
  " style="--set-logo-reference-aspect-ratio: 2.5;">

    <div class="container">

      <div id="set-search-result-header">

        <div id="set-search-result-title">

        <span id="set-search-result-title-count">
          1
        </span>

          <span id="set-search-result-title-name">
          sets found</span>
        </div>

        <div id="set-search-result-compact-header-buttons">
          <button type="button" title="Show the display options" aria-label="Show the display options" class="set-search-result-compact-header-button" data-show="drawer" data-target="#set-display-options-drawer">
            <span aria-hidden="true" class="fa-solid fa-arrow-down-wide-short"></span>
          </button>
        </div>

      </div>

      <div id="set-display-options">

        <div class="set-display-option">

          <label>Sort by</label>

          <button type="button" class="
        dropdown-toggle
        button button-link-like-alt      " data-toggle="dropdown" data-target="#dropdown-685576854" fdprocessedid="0wmvjq">
            <span aria-hidden="true" class="dropdown-toggle-caret"></span>
            Series
          </button>

          <div id="dropdown-685576854" class="
    dropdown
          dropdown-selectable
        set-display-option-dropdown  " data-toggle-text-separator=", " data-query-string-key="sortBy">

            <div class="dropdown-menu">

              <div class="dropdown-menu-content">

                <div class="dropdown-option selected" tabindex="0" data-value="expansionSeries">
                  Series
                </div>

                <div class="dropdown-option " tabindex="0" data-value="releaseDate">
                  Release date
                </div>

                <div class="dropdown-option " tabindex="0" data-value="cardCollectionProgress">
                  Collection progress
                </div>

                <div class="dropdown-option " tabindex="0" data-value="marketPriceDesc">
                  Market price (desc)
                </div>

                <div class="dropdown-option " tabindex="0" data-value="marketPriceAsc">
                  Market price (asc)
                </div>

              </div>

            </div>

          </div>

        </div>

        <div class="set-display-option">

          <label>From</label>

          <button type="button" class="
        dropdown-toggle
        button button-link-like-alt      " data-toggle="dropdown" data-target="#dropdown-2085179571" fdprocessedid="f247hk">
            <span aria-hidden="true" class="dropdown-toggle-caret"></span>
            New to old
          </button>

          <div id="dropdown-2085179571" class="
    dropdown
          dropdown-selectable
        set-display-option-dropdown  " data-toggle-text-separator=", " data-query-string-key="releaseDateOrder">

            <div class="dropdown-menu">

              <div class="dropdown-menu-content">

                <div class="dropdown-option selected" tabindex="0" data-value="newToOld">
                  New to old
                </div>

                <div class="dropdown-option " tabindex="0" data-value="oldToNew">
                  Old to new
                </div>

              </div>

            </div>

          </div>

        </div>

        <div class="set-display-option">

          <label>Show</label>

          <button type="button" class="
        dropdown-toggle
        button button-link-like-alt      " data-toggle="dropdown" data-target="#dropdown-1168574368" fdprocessedid="ly3olr">
            <span aria-hidden="true" class="dropdown-toggle-caret"></span>
            Logos
          </button>

          <div id="dropdown-1168574368" class="
    dropdown
          dropdown-selectable
        set-display-option-dropdown  " data-toggle-text-separator=", " data-query-string-key="displayAs">

            <div class="dropdown-menu">

              <div class="dropdown-menu-content">

                <div class="dropdown-option " tabindex="0" data-value="list">
                  List
                </div>

                <div class="dropdown-option selected" tabindex="0" data-value="logos">
                  Logos
                </div>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>

    <div id="expansion-series-nav" class="">
      <div class="container">
        <div id="expansion-series-nav-content">

          <button type="button" title="Show all series" aria-label="Show all series" id="expansion-series-nav-drawer-show-button" data-show="drawer" data-target="#expansion-series-nav-drawer" fdprocessedid="mim3ea">
            <span aria-hidden="true" class="button-icon fa-solid fa-list-ul"></span>
          </button>

          <button type="button" title="Scroll left" aria-label="Scroll left" id="expansion-series-nav-scroll-left-button" class="hidden">
            <span aria-hidden="true" class="button-icon fa-solid fa-chevron-left"></span>
          </button>

          <div id="expansion-series-nav-jump-links">
            <a href="#gem-pack-era" title="Jump to 'Gem Pack Era'" aria-label="Jump to 'Gem Pack Era'" class="expansion-series-nav-jump-link">
              Gem Pack Era
            </a>

          </div>

          <button type="button" title="Scroll right" aria-label="Scroll right" id="expansion-series-nav-scroll-right-button" class="hidden" fdprocessedid="r2fze8">
            <span aria-hidden="true" class="button-icon fa-solid fa-chevron-right"></span>
          </button>

        </div>
      </div>
    </div>

    <div class="container">

      <div id="set-logo-grids">

        <!-- Where the real Era and Set data will go. -->

      </div>

    </div>

  </div>

</main>
      `;
    }
  }

  let RegionContainer = document.querySelector("#tcg-region-links-button-group");

  if (RegionContainer) {
    const schnLink = document.createElement("a");

    const url = window.location.pathname;
    if (url.includes("/sets/")) {
      schnLink.href = "/sets/schn";
    } else if (url.includes("/dashboard")) {
      schnLink.href = "/dashboard/schn";
    } else if (url.includes("/cards")) {
      schnLink.href = "/cards/schn";
    } else {
      schnLink.href = "/pluspluserror";
    }

    if (window.location.pathname === "/sets/schn") {
      schnLink.className = "tcg-region-links-button-group-link button button-plain-alt active";
      console.log("Changed SCHN button to active ✅")
    } else {
      schnLink.className = "tcg-region-links-button-group-link button button-plain-alt";
    }

    console.log(window.location.pathname);

    schnLink.setAttribute("data-tcg-region-id", "3");
    schnLink.setAttribute("data-link-visitor-disabled", "");
    schnLink.innerText = "S. Chinese";

    RegionContainer.appendChild(schnLink);
    console.log("S. Chinese button made (" + schnLink.href + ") ✅");

    if (window.location.pathname === "/sets/schn") {
      const schnSetsPageTitle = "Pokémon TCG Sets (Simplified Chinese) - TCGCollector";
      if (document.title !== schnSetsPageTitle) {
        document.title = schnSetsPageTitle;
      }
      console.log("Changed Page Title to " + schnSetsPageTitle + " ✅")
    }

    function drawSetCode(text) {
      const targetWidth = 60;
      const targetHeight = 40;
      const padding = 5;
      const scale = 10;

      const canvas = document.createElement("canvas");
      canvas.width = targetWidth * scale;
      canvas.height = targetHeight * scale;
      const ctx = canvas.getContext("2d");

      ctx.scale(scale, scale);

      ctx.fillStyle = "black";
      ctx.fillRect(0, 0, targetWidth, targetHeight);

      ctx.lineWidth = 2;
      ctx.strokeStyle = "white";
      ctx.strokeRect(1, 1, targetWidth - 2, targetHeight - 2);

      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = "white";

      let fontSize = targetHeight;
      let spacing = 2;
      let fits = false;
      let chars, totalWidth, textHeight;

      while (fontSize > 5 && !fits) {
        ctx.font = `bold ${fontSize}px 'Gill Sans MT Condensed', sans-serif`;

        chars = text.split("");
        totalWidth =
            chars.reduce((w, ch) => w + ctx.measureText(ch).width, 0) +
            (chars.length - 1) * spacing;

        textHeight =
            ctx.measureText("M").actualBoundingBoxAscent +
            ctx.measureText("M").actualBoundingBoxDescent;

        if (
            totalWidth <= targetWidth - padding * 2 &&
            textHeight <= targetHeight - padding * 2
        ) {
          fits = true;
        } else {
          fontSize -= 1;
        }
      }

      const total = totalWidth;
      let x = (targetWidth - total) / 2;
      const y = targetHeight / 2;

      for (const ch of chars) {
        const charWidth = ctx.measureText(ch).width;
        ctx.fillText(ch, x + charWidth / 2, y);
        x += charWidth + spacing;
      }

      return canvas.toDataURL("image/png");
    }

    let schn_eras_data
    let schn_sets_data

    async function loadSCHNData() {
      try {
        if (window.location.pathname === "/sets/schn") {
          {
            const {data, error} = await supabase.from("schn_eras").select("id, name");
            if (error) throw error;
            schn_eras_data = data;
          }
          {
            const {data, error} = await supabase.from("schn_sets").select("id, name, era, release_date, total_cards, total_cards_variants, set_code, set_price, set_image_link, set_path");
            if (error) throw error;
            schn_sets_data = data;
            console.log(schn_sets_data);
          }

          const schnRepDataContainer = document.querySelector("#set-logo-grids");
          if (schnRepDataContainer) {
            schnRepDataContainer.innerHTML = ""; // clear existing elements

            schn_eras_data.forEach(era => {
              let schnHTMLElements = `
    <div id="${era.name.toLowerCase().replace(/\s+/g, "-")}" class="set-logo-grid">
      <h2 class="set-logo-grid-title">${era.name}</h2>
      <div class="set-logo-grid-items">
  `;

              const schnSetElements = schn_sets_data.filter(set => set.era === era.name);

              if (schnSetElements.length === 0) {
                schnHTMLElements += `<p>No sets found for this era.</p>`;
              } else {
                schnSetElements.forEach(set => {
                  schnHTMLElements += `
        <div class="set-logo-grid-item set-has-cards set-has-code set-has-symbol">
          <div class="set-logo-grid-item-header">
            <img src="${drawSetCode(set.set_code)}" 
                 srcset="${drawSetCode(set.set_code)} 25w, ${drawSetCode(set.set_code)} 46w" 
                 loading="eager" 
                 alt="${set.name}" 
                 width="25" 
                 height="14" 
                 class="set-symbol set-logo-grid-item-set-symbol">

            <span class="set-logo-grid-item-set-name-container">
              <a href="/sets/${set.set_path}" title="${set.name}" class="set-logo-grid-item-set-name">
                ${set.name}
              </a>
              <span class="set-logo-grid-item-set-code">${set.set_code}</span>
            </span>
          </div>

          <div class="set-logo-grid-item-body">
            <a href="/sets/${set.set_path}" class="set-logo-grid-item-set-logo-container">
              <img src="${set.set_image_link}" 
                   srcset="${set.set_image_link} 519w" 
                   loading="eager" 
                   alt="${set.name}" 
                   width="250" 
                   height="60" 
                   class="set-logo-grid-item-set-logo is-wider-than-reference">
            </a>

            <div class="set-logo-grid-item-text-content">
              <div class="set-logo-grid-item-release-date">${set.release_date}</div>
              <div class="set-logo-grid-item-price">
                <a href="/pluspluserror" rel="external nofollow" target="_blank" title="View card prices" aria-label="View card prices">$—</a>
              </div>
            </div>
          </div>

          <div class="set-logo-grid-item-footer">
            <div class="set-logo-grid-item-status">
              <div class="progress set-logo-grid-item-status-progress" style="--progress-percentage: 1%;">
                <div class="progress-label">0/${set.total_cards_variants}</div>
                <div class="progress-percentage">0%</div>
                <div aria-hidden="true" class="progress-bar"></div>
              </div>
            </div>

            <button type="button" 
                    class="set-like-card-collection-details-drawer-show-button set-logo-grid-item-collection-details-drawer-show-button button button-small button-plain"
                    data-set-like-id="${set.id}" data-set-mode="allCardVariants">
              <span aria-hidden="true" class="button-icon fa-solid fa-chart-simple"></span>
              View details
            </button>
          </div>
        </div>
      `;
                });
              }

              schnHTMLElements += `</div></div>`;

              schnRepDataContainer.innerHTML += schnHTMLElements;
            });
          }
        }
      } catch (err) {
        console.error("Database error:", err, " ❌");
      }
    }

    loadSCHNData();
  }
}

// run this func once, can set up the MutationObserver if you want
injectSimplifiedChinese();

// // set up MutationObserver to re-run when inevitably DOM changes
// const schnObserver = new MutationObserver(() => {
//   injectSimplifiedChinese();
// });

// schnObserver.observe(document.body, {
//   childList: true,
//   subtree: true,
// });

function enableDarkMode() {
  const styles = document.createElement('style')
  styles.innerHTML = `
  @media (prefers-color-scheme: dark) {
    body {
      background-color: #313131;
      color: #efefef;
    }

    .list-group>.list-group-heading, .list-group>.list-group-item {
      background-color: #424242;
      border-color: #757575;
      color: #cecece;
    }

    .button-plain-alt, .button-plain-alt.disabled, .button-plain-alt:disabled {
      background-color: #424242;
      border-color: #757575;
      color: #cecece;
    }

    .button-plain, .button-plain.disabled, .button-plain:disabled {
      background-color: #424242;
      border-color: #757575;
      color: #cecece;
    }

    .button-plain>.button-icon {
      color: #fa7035;
    }

    .audit-log-list-group-item-datetime {
      color: #cecece;
    }

    .expansion-logo-grid-item-price:not(a), .expansion-logo-grid-item-release-date {
      color: #cecece;
    }

    .radio-label {
      color: #cecece;
    }

    .progress>.progress-label {
      color: #cecece;
    }
    
    // // Nico added this
    // #page-content #set-search-result #expansion-series-nav {
    //   color: #cecece;
    // }

    .progress>.progress-percentage {
      color: #cecece;
    }

    .progress>.progress-bar {
      background-color: black;
    }

    .form-control {
      background-color: #424242;
      border-color: #757575;
      color: #cecece;
    }

    .form-control:focus {
      border-color: #fa7035;
      outline: 0;
      background-color: #424242;
      color: #cecece;
    }

    .card-image-controls-item-rarity>.card-rarity-symbol {
      background-color: white;
    }

    .dropdown-menu, .dropdown-menu-arrow , .dropdown-menu-content {
      background-color: #424242;
      color: #cecece;
    }
    
    .number-spinner-value {
      color: white;
    }

    .modal-header {
      background-color: #212121;
      color: #cecece;
    }

    .drawer {
      background-color: #212121;
      color: #cecece;
    }

    .card-collection-expansion-details-drawer-card {
      background-color: #111;
    }

    a.card-collection-expansion-details-drawer-card, a.card-collection-expansion-details-drawer-card:focus, a.card-collection-expansion-details-drawer-card:hover {
      color: white;
    }

    .list-group .list-group-item-side-item-icon {
      color: #fa7035;
    }

    .card-image-grid-item-info-overlay-text {
      background-color: #535353;
      border-top-color: #fa7035;
    }
    
    .card-image-grid-item-info-overlay-text {
      color: #cecece;
      border-top-right-color: #fa7035;
    }

    .card-collection-card-indicator {
      background-color: #111;
    }

    .card-wishlist-toggle-button-icon {
      color: #535353;
    }

    .dropdown-option {
      color: #cecece;
    }
  }

  .button.collector {
    margin-left: 8px;
  }
  `
  document.head.appendChild(styles)
}

function handleGridAction(cols, gridStyles) {
  const gridItems = document.querySelectorAll('.card-image-grid-item')
  const pastPages = document.querySelectorAll('.newpagegrid')
  // Cleanup
  pastPages.forEach(el => {
    el.remove()
  })

  gridStyles.innerHTML = `
  @media (min-width: 960px) and (max-width: 1159.98px) {
    #card-image-grid {
      grid-template-columns: repeat(${cols}, minmax(0, 1fr));
      width: 720px;
    }

    .card-image-grid-item {
      width: 160px;
    }
  }

  @media (min-width: 1160px) {
    #card-image-grid {
      grid-template-columns: repeat(${cols}, minmax(0, 1fr));
      width: 720px;
    }

    .card-image-grid-item {
      width: 200px;
    }
  }

  div.newpagegrid hr {
    background-color: white;
  }

  div.newpagegrid hr.backside {
    opacity: 0.7;
  }
  `
  const frontPage = cols * cols
  const backPage = frontPage * 2
  gridItems.forEach((el, i) => {
    if (i % backPage === 0) {
      const newPageGrid = document.createElement('div')
      const pageNo = document.createElement('span')
      const hr = document.createElement('hr')
      pageNo.innerText = `Front ${Math.floor(i / backPage) + 1}`
      hr.className = 'newpage'
      newPageGrid.className = 'newpagegrid'
      newPageGrid.appendChild(pageNo)
      newPageGrid.appendChild(hr)
      el.prepend(newPageGrid)
    } else if (i % frontPage === 0) {
      const newPageGrid = document.createElement('div')
      const pageNo = document.createElement('span')
      const hr = document.createElement('hr')
      pageNo.innerText = `Backside ${Math.floor(i / backPage) + 1}`
      hr.className = 'backside'
      newPageGrid.className = 'newpagegrid'
      newPageGrid.appendChild(pageNo)
      newPageGrid.appendChild(hr)
      el.prepend(newPageGrid)
    }
  })
}

function attachOrganizerButtons() {
  const organizer = document.querySelector('#card-display-options-container')
  if (!organizer) return // Bail early
  const gridStyles = document.createElement('style')
  const gridRow = document.createElement('div')

  const btn2x2 = document.createElement('a')
  btn2x2.innerHTML = ''
  btn2x2.className = 'button button-plain collector'
  btn2x2.role = 'button'
  btn2x2.onclick = () => {
    handleGridAction(2, gridStyles)
  }
  const icon2x2 = document.createElement('span')
  icon2x2.className = 'fa-solid fa-table-cells-large button-icon'
  btn2x2.appendChild(icon2x2)
  gridRow.appendChild(btn2x2)

  const btn3x3 = document.createElement('a')
  btn3x3.className = 'button button-plain collector'
  btn3x3.role = 'button'
  btn3x3.onclick = () => {
    handleGridAction(3, gridStyles)
  }
  const icon3x3 = document.createElement('span')
  icon3x3.className = 'fa-solid fa-table-cells button-icon'
  btn3x3.appendChild(icon3x3)
  gridRow.appendChild(btn3x3)

  const btnClear = document.createElement('a')
  btnClear.className = 'button button-plain collector'
  btnClear.role = 'button'
  btnClear.onclick = () => {
    const pastPages = document.querySelectorAll('.newpagegrid')
    // Cleanup
    pastPages.forEach(el => {
      el.remove()
    })
    gridStyles.innerHTML = `
    @media (min-width: 960px) and (max-width: 1159.98px) {
      #card-image-grid {}
    }
  
    @media (min-width: 1160px) {
      #card-image-grid {}
    }
    `
  }
  const iconClear = document.createElement('span')
  iconClear.className = 'fa-solid fa-border-none button-icon'
  btnClear.appendChild(iconClear)
  gridRow.appendChild(btnClear)

  copyBulk = document.createElement('a')
  copyBulk.className = 'button button-plain collector'
  copyBulk.role = 'button'
  copyBulk.onclick = () => {
    const setCode = document.querySelector('#card-search-result-title-expansion-code').innerText.trim()
    const textEntries = []
    const cardsInGrid = document.querySelectorAll('.card-image-grid-item-card-title')
    for (const card of cardsInGrid.values()) {
      const cardText = card.innerText.trim()
      const parser = new RegExp('(.+?)\\(.+\\s(\\d+)/\\d+\\)')
      console.log(cardText, parser.exec(cardText))
      const [_, title, number] = parser.exec(cardText)
      textEntries.push(`1 ${title.trim()} [${setCode}]`)
    }
    console.log(textEntries.join('\n'))
    navigator.clipboard.writeText(textEntries.join('\n'))
    alert(`Copied ${cardsInGrid.length} cards to the clipboard`)
  }
  const iconCopy = document.createElement('span')
  iconCopy.className = 'fa-solid fa-copy button-icon'
  copyBulk.appendChild(iconCopy)
  const cardSourceFilter = document.querySelector('#card-source-radios')
  cardSourceFilter.addEventListener('input', () => {
    setTimeout(() => {
      const organizer = document.querySelector('#card-display-options-container')
      organizer.append(gridStyles, gridRow)
    }, 500)
  })
  gridRow.appendChild(copyBulk)

  gridRow.className = 'card-display-option'
  organizer.append(gridStyles, gridRow)
}

// document.body.style.backgroundColor = 'navy'
enableDarkMode()
attachOrganizerButtons()