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
		const postsPromise = fetch(`${universityData.base_url}/wp-json/wp/v2/posts?search=${this.searchTerm}`)
		const pagesPromise = fetch(`${universityData.base_url}/wp-json/wp/v2/pages?search=${this.searchTerm}`)

		Promise.all([postsPromise, pagesPromise])
			.then(blobs => Promise.all(blobs.map(blob => blob.json())))
			.then(([posts, pages]) => {
				const data = posts.concat(pages)
				this.outputSection.innerHTML = ''
				const title = document.createElement('h2')
				const itemList = document.createElement('ul')
				const noResult = document.createElement('p') 
				title.textContent = 'General Information'
				noResult.textContent = `No general information found matching "${this.searchTerm}".`
				title.classList.add('search-overlay__section-title')
				itemList.classList.add('link-list')
				itemList.classList.add('min-list')


				this.outputSection.appendChild(title)
				if (!data.length) {
					this.outputSection.appendChild(noResult)
					this.isSpinnerVisible = false
					return
				}

				data.forEach(post => {
					const item = document.createElement('li')
					const itemLink = document.createElement('a')
					itemLink.textContent = post.title.rendered
					itemLink.href = post.link
					item.appendChild(itemLink)
					if (post.type == 'post') {
						const authorName = document.createElement('span')
						authorName.textContent = ` by ${post.authorName}` 
						item.appendChild(authorName)
					}
					itemList.appendChild(item)
				})

				this.outputSection.appendChild(itemList)
				this.isSpinnerVisible = false
			})
	}
}

export default Search