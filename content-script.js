function addSimplifiedChinese() {
  const schnElement = document.createElement("a");
  schnElement.href = "/sets/schn";
  schnElement.className = "tcg-region-links-button-group-link button button-plain-alt";
  schnElement.setAttribute("data-tcg-region-id", "3");
  schnElement.setAttribute("data-link-visitor-disabled", "");
  schnElement.innerText = "S. Chinese";
  
  const container = document.querySelector(".tcg-region-links-button-group");
  if (container) {
    container.appendChild(schnElement);
  } else {
    console.log("Container not found, injecting at body instead");
    document.body.appendChild(schnElement);
  }
}

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
  pastPages.forEach(el => { el.remove() })

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
      pageNo.innerText = `Front ${Math.floor(i/backPage) + 1}`
      hr.className = 'newpage'
      newPageGrid.className = 'newpagegrid'
      newPageGrid.appendChild(pageNo)
      newPageGrid.appendChild(hr)
      el.prepend(newPageGrid)
    } else if (i % frontPage === 0) {
      const newPageGrid = document.createElement('div')
      const pageNo = document.createElement('span')
      const hr = document.createElement('hr')
      pageNo.innerText = `Backside ${Math.floor(i/backPage) + 1}`
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
  btn2x2.onclick = () => { handleGridAction(2, gridStyles) }
  const icon2x2 = document.createElement('span')
  icon2x2.className = 'fa-solid fa-table-cells-large button-icon'
  btn2x2.appendChild(icon2x2)
  gridRow.appendChild(btn2x2)

  const btn3x3 = document.createElement('a')
  btn3x3.className = 'button button-plain collector'
  btn3x3.role = 'button'
  btn3x3.onclick = () => { handleGridAction(3, gridStyles) }
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
    pastPages.forEach(el => { el.remove() })
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

// document.body.style.backgroundColor = 'black'
enableDarkMode()
attachOrganizerButtons()
