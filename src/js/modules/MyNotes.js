import $ from 'jquery'

class MyNotes {
	constructor() {
		this.events()
	}

	events() {
		$('.delete-note').on('click', this.deleteNote);
		$('.edit-note').on('click', this.editNote.bind(this));
		$('.update-note').on('click', this.updateNote.bind(this));
	}

	deleteNote(e) {
		const note = $(e.target).parents('li')

		fetch(`${universityData.base_url}/wp-json/wp/v2/note/${note.data('id')}`, {
			method: 'DELETE',
			headers: {
				'X-WP-Nonce': universityData.nonce
			}
		})
		.then(blob => blob.json())
		.then(() => {
			note.slideUp()
		})
		.catch((err) => {
			console.log(err);
		})
	}

	updateNote(e) {
		const note = $(e.target).parents('li')

		const payload = {
			'title': note.find('.note-title-field').val(),
			'content': note.find('.note-body-field').val()
		}

		$.ajax({
			beforeSend: (xhr) => {
				xhr.setRequestHeader('X-WP-Nonce', universityData.nonce)
			},
			url: `${universityData.rest_url}wp/v2/note/${note.data('id')}`,
			method: 'POST',
			data: payload,
			success: (res) => {
				this.markNoteReadonly(note)
				console.log(res);
			},
			error: (err) => {
				console.log(err);
			}
		})

		// const data = new FormData()
		// data.append('title', note.find('.note-title-field').val())
		// data.append('content', note.find('.note-body-field').val())

		// fetch(`${universityData.rest_url}wp/v2/note/${note.data('id')}`, {
		// 	method: 'POST',
		// 	headers: {
		// 		'X-WP-Nonce': universityData.nonce,
		// 		'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
		// 	},
		// 	data,
		// })
		// .then(blob => blob.json())
		// .then((res) => {
		// 	this.markNoteReadonly(note)
		// 	console.log(res);
		// })
		// .catch((err) => {
		// 	console.log(err);
		// })
	}

	editNote(e) {
		const note = $(e.target).parents('li')

		if (note.data('state') == 'editable') {
			this.markNoteReadonly(note)
		} else {
			this.markNoteEditable(note)
		}

	}

	markNoteEditable(note) {
		note.find('.edit-note').html(`<i class="fa fa-times" aria-hidden="true"></i> Cancel`)
		note.find('.note-title-field, .note-body-field').removeAttr('readonly').addClass('note-active-field')
		note.find('.update-note').addClass('update-note--visible')
		note.data('state', 'editable')
	}

	markNoteReadonly(note) {
		note.find('.edit-note').html(`<i class="fa fa-pencil" aria-hidden="true"></i> Edit`)
		note.find('.note-title-field, .note-body-field').attr('readonly', 'readonly').removeClass('note-active-field')
		note.find('.update-note').removeClass('update-note--visible')
		note.data('state', 'cancel')
	}
}

export default MyNotes;