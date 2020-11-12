import $ from 'jquery';

class MyNotes {
	constructor() {
		this.events();
	}

	events() {
		$('#my-notes').on('click', '.delete-note', this.deleteNote);
		$('#my-notes').on('click', '.edit-note', this.editNote.bind(this));
		$('#my-notes').on('click', '.update-note', this.updateNote.bind(this));
		$('.submit-note').on('click', this.createNote.bind(this));
	}

	deleteNote(e) {
		const note = $(e.target).parents('li');

		fetch(`${universityData.base_url}/wp-json/wp/v2/note/${note.data('id')}`, {
			method: 'DELETE',
			headers: {
				'X-WP-Nonce': universityData.nonce,
			},
		})
			.then((blob) => blob.json())
			.then(() => {
				note.slideUp();
			})
			.catch((err) => {
				console.log(err);
			});
	}

	createNote() {
		const payload = {
			title: $('.new-note-title').val(),
			content: $('.new-note-body').val(),
			status: 'publish',
		};

		$.ajax({
			beforeSend: (xhr) => {
				xhr.setRequestHeader('X-WP-Nonce', universityData.nonce);
			},
			url: `${universityData.rest_url}wp/v2/note`,
			method: 'POST',
			data: payload,
			success: (res) => {
				console.log(res);
				$('.new-note-title, .new-note-body').val('');

				const bodyContent = `
					<li data-id=${res.id}>
						<input readonly class="note-title-field" type="text" value=${res.title.raw}>
						<span class="edit-note"><i class="fa fa-pencil" aria-hidden="true"></i> Edit</span>
						<span class="delete-note"><i class="fa fa-trash-o" aria-hidden="true"></i> Delete</span>
						<textarea readonly class="note-body-field" name="body" id="body">${res.content.raw}</textarea>
						<span class="update-note btn btn--blue bnt--small"><i class="fa fa-arrow-right" aria-hidden="true"></i> Save</span>
					</li>
				`;

				$(bodyContent).prependTo('#my-notes').hide().slideDown();

				if (parseInt(res.noteCount, 10) <= 5) {
					$('.note-limit-message').removeClass('active');
				}
			},
			error: (err) => {
				console.log(err);
				if (err.responseText == 'your have reached your notes limit.') {
					$('.note-limit-message').addClass('active');
				}
			},
		});
	}

	updateNote(e) {
		const note = $(e.target).parents('li');

		const payload = {
			title: note.find('.note-title-field').val(),
			content: note.find('.note-body-field').val(),
		};

		$.ajax({
			beforeSend: (xhr) => {
				xhr.setRequestHeader('X-WP-Nonce', universityData.nonce);
			},
			url: `${universityData.rest_url}wp/v2/note/${note.data('id')}`,
			method: 'POST',
			data: payload,
			success: (res) => {
				this.markNoteReadonly(note);
				console.log(res);
			},
			error: (err) => {
				console.log(err);
			},
		});

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
		const note = $(e.target).parents('li');

		if (note.data('state') == 'editable') {
			this.markNoteReadonly(note);
		} else {
			this.markNoteEditable(note);
		}
	}

	markNoteEditable(note) {
		note
			.find('.edit-note')
			.html(`<i class="fa fa-times" aria-hidden="true"></i> Cancel`);
		note
			.find('.note-title-field, .note-body-field')
			.removeAttr('readonly')
			.addClass('note-active-field');
		note.find('.update-note').addClass('update-note--visible');
		note.data('state', 'editable');
	}

	markNoteReadonly(note) {
		note
			.find('.edit-note')
			.html(`<i class="fa fa-pencil" aria-hidden="true"></i> Edit`);
		note
			.find('.note-title-field, .note-body-field')
			.attr('readonly', 'readonly')
			.removeClass('note-active-field');
		note.find('.update-note').removeClass('update-note--visible');
		note.data('state', 'cancel');
	}
}

export default MyNotes;
