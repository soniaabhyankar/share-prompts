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

	const filterPrompts = (searchText) => {
		const regexString = new RegExp(searchText, 'i');

		return allPosts.filter(
			(post) => regexString.test(post.tag) || regexString.test(post.prompt) || regexString.test(post.creator.username)
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

			{filteredPosts.length >= 1 ? (
				<PromptCardList data={filteredPosts} handleTagClick={() => {}} />
			) : (
				<PromptCardList data={allPosts} handleTagClick={() => {}} />
			)}
		</section>
	);
};

export default Feed;
