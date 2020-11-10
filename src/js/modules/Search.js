class Search {
	constructor() {
		this.openSearchBtn = document.querySelector('.search-trigger')
		this.closeSearchBtn = document.querySelector('.search-overlay__close')
		this.searchOverlay = document.querySelector('.search-overlay')
		this.searchField = document.querySelector('#search-term')
		this.outputSection = document.querySelector('#search-overlay__results')
		this.isOverlayOpen = false
		this.isSpinnerVisible = false
		this.inputTimer = null
		this.searchTerm = ''
		
		this.events()
	}

	events() {
		this.openSearchBtn.addEventListener('click', this.openOverlay.bind(this))
		this.closeSearchBtn.addEventListener('click', this.closeOverlay.bind(this))
		document.addEventListener('keyup', this.keyPressDispatcher.bind(this))
		document.addEventListener('keydown', this.keyPressDispatcher.bind(this))
		this.searchField.addEventListener('keyup', this.searchInputs.bind(this))
	}

	openOverlay() {
		this.searchOverlay.classList.add('search-overlay--active')
		document.body.classList.add('body-no-scroll')
		this.searchField.value = ''
		setTimeout(() => this.searchField.focus(), 350);
		this.isOverlayOpen = true
	}

	closeOverlay() {
		this.searchOverlay.classList.remove('search-overlay--active')
		document.body.classList.remove('body-no-scroll')
		this.isOverlayOpen = false
	}

	keyPressDispatcher({keyCode}) {
		// TODO(karim): check if other inputs are focused
		if (keyCode == 83 && !this.isOverlayOpen) {
			this.openOverlay()
		} else if (keyCode == 27 && this.isOverlayOpen) {
			this.closeOverlay()
		}
	}

	searchInputs() {
		const { value } = this.searchField
		if (value != this.searchTerm) {
			clearTimeout(this.inputTimer)

			if (value == '') {
				this.outputSection.innerHTML = ''
				this.isSpinnerVisible = false
			} else {
				if (!this.isSpinnerVisible) {
					this.outputSection.innerHTML = '<div class="spinner-loader"></div>'
					this.isSpinnerVisible = true
				}		
				this.inputTimer = setTimeout(this.getResults.bind(this), 750)
			}
		}

		this.searchTerm = value;
	}
	
	getResults() {
		fetch(`${universityData.base_url}/wp-json/university/v1/search?term=${this.searchTerm}`)
			.then(res => res.json())
			.then(data => {
				this.outputSection.innerHTML = ''

				const row = document.createElement('div')
				const col1 = document.createElement('div')
				const col2 = document.createElement('div')
				const col3 = document.createElement('div')
				const generalTitle = this.createTitle('General Information')
				const programsTitle = this.createTitle('Programs')
				const professorsTitle = this.createTitle('Professors')
				const campusesTitle = this.createTitle('Campuses')
				const eventsTitle = this.createTitle('Events')

				row.classList.add('row')
				col1.classList.add('one-third')
				col2.classList.add('one-third')
				col3.classList.add('one-third')

				col1.appendChild(generalTitle);
				col1.appendChild(this.addItem(data.generalInfo, `No general information found matching "${this.searchTerm}".`))

				col2.appendChild(programsTitle)
				col2.appendChild(this.addItem(data.programs, `No programs match that search.`))
				col2.appendChild(professorsTitle)
				col2.appendChild(this.addItem(data.professors, `No prefessors match that search.`))


				col3.appendChild(campusesTitle)
				col3.appendChild(this.addItem(data.campuses, `No compuses match that search.`))
				col3.appendChild(eventsTitle)
				col3.appendChild(this.addItem(data.events, `No events match that search.`))
				
				row.appendChild(col1)
				row.appendChild(col2)
				row.appendChild(col3)
				this.outputSection.appendChild(row)
				this.isSpinnerVisible = false
			})
	}

	addItem(data, noResultText) {
		if (!data.length) {
			this.isSpinnerVisible = false
			const noResult = document.createElement('p') 
			noResult.textContent = noResultText
			return noResult
		}

		const ul = document.createElement('ul')
		ul.classList.add('link-list')
		ul.classList.add('min-list')

		data.forEach(res => {
			const item = document.createElement('li')
			const itemLink = document.createElement('a')
			itemLink.textContent = res.title
			itemLink.href = res.permalink
			item.appendChild(itemLink)
			if (res?.postType === 'post') {
				const authorName = document.createElement('span')
				authorName.textContent = ` by ${res.authorName}` 
				item.appendChild(authorName)
			}						
			ul.appendChild(item)
		})

		return ul;
	}

	createTitle(text) {
		const title = document.createElement('h2')
		title.classList.add('search-overlay__section-title')
		title.textContent = text
		return title;
	}
}

export default Search
