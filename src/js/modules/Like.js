import $ from 'jquery';

class Like {
	constructor() {
		this.events();
	}

	events() {
		$('.like-box').on('click', this.clickDispatcher.bind(this));
	}

	clickDispatcher(e) {
		const currentLikeBox = $(e.target).closest('.like-box');

		if (currentLikeBox.attr('data-exists') == 'yes') {
			this.deleteLike(currentLikeBox);
		} else {
			this.createLike(currentLikeBox);
		}
	}

	createLike(likeBox) {
		const data = {
			professorId: likeBox.data('professor'),
		};

		$.ajax({
			url: `${universityData.rest_url}/university/v1/manageLike`,
			type: 'POST',
			data,
			beforeSend: (xhr) => {
				xhr.setRequestHeader('X-WP-Nonce', universityData.nonce);
			},
			success: (res) => {
				likeBox.attr('data-exists', 'yes');

				let likeCount = parseInt(likeBox.find('.like-count').html(), 10);
				likeCount++;

				likeBox.find('.like-count').html(likeCount);

				likeBox.attr('data-like', res);
			},
			error: (err) => console.log(err),
		});
	}

	deleteLike(likeBox) {
		const data = {
			like: likeBox.attr('data-like'),
		};

		$.ajax({
			url: `${universityData.rest_url}university/v1/manageLike`,
			type: 'DELETE',
			data,
			beforeSend: (xhr) => {
				xhr.setRequestHeader('X-WP-Nonce', universityData.nonce);
			},
			success: (res) => {
				likeBox.attr('data-exists', 'no');

				let likeCount = parseInt(likeBox.find('.like-count').html(), 10);
				if (likeCount > 0) {
					likeCount--;
				}

				likeBox.find('.like-count').html(likeCount);

				likeBox.attr('data-like', '');
			},
			error: (err) => console.log(err),
		});
	}
}

export default Like;
