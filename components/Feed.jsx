'use client';

import { useState, useEffect } from 'react';
import PromptCard from './PromptCard';

const PromptCardList = ({ data, handleTagClick }) => {
	return (
		<div className='mt-16 prompt_layout'>
			{data.map((post) => (
				<PromptCard key={post._id} post={post} handleTagClick={handleTagClick} />
			))}
		</div>
	);
};

const Feed = () => {
	const [allPosts, setAllPosts] = useState([]);

	// Search states
	const [searchText, setSearchText] = useState('');
	const [filteredPosts, setFilteredPosts] = useState([]);
	const [searchTimeout, setSearchTimeout] = useState(null);

	useEffect(() => {
		const fetchPosts = async () => {
			const response = await fetch('/api/prompt');

			const data = await response.json();

			console.log(data);
			setAllPosts(data);
		};

		fetchPosts();
	}, []);

	const filterPrompts = (searchText, filterByTag = false) => {
		const regexString = new RegExp(searchText, 'i');

		if (filterByTag) return allPosts.filter((post) => regexString.test(post.tag));

		return allPosts.filter(
			(post) => regexString.test(post.creator.username) || regexString.test(post.tag) || regexString.test(post.prompt)
		);
	};

	const handleSearchChange = (e) => {
		clearTimeout(searchTimeout);
		setSearchText(e.target.value);

		setSearchTimeout(
			setTimeout(() => {
				const filterResults = filterPrompts(e.target.value);
				setFilteredPosts(filterResults);
			}, 500)
		);
	};

	const handleTagClick = (tag) => {
		setSearchText(tag);

		const filterResults = filterPrompts(tag, true);

		setFilteredPosts(filterResults);
	};

	return (
		<section className='feed'>
			<form className='relative w-full flex-center'>
				<input
					type='text'
					placeholder='Search for a tag or a username'
					value={searchText}
					onChange={handleSearchChange}
					className='search_input peer'
				/>
			</form>

			{searchText ? (
				<PromptCardList data={filteredPosts} handleTagClick={handleTagClick} />
			) : (
				<PromptCardList data={allPosts} handleTagClick={handleTagClick} />
			)}
		</section>
	);
};

export default Feed;
