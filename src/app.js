const express = require('express');
const cors = require('cors');
const { uuid } = require('uuidv4');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get('/repositories', (request, response) => {
	return response.json(repositories);
});

app.post('/repositories', (request, response) => {
	const { title, url, techs } = request.body;

	if (!url.includes('https://github.com/')) {
		return response.status(400).json({ error: 'Invalid URL' });
	}

	const repository = {
		id: uuid(),
		title,
		url,
		techs,
		likes: 0,
	};

	repositories.push(repository);

	return response.json(repository);
});

app.put('/repositories/:id', (request, response) => {
	const { id } = request.params;
	const repoIndex = repositories.findIndex((repo) => repo.id === id);

	if (repoIndex < 0) {
		return response.status(400).json({ error: 'Repository not found' });
	}

	const { title, url, techs } = request.body;

	const likes = repositories[repoIndex].likes;
	const newTitle = !title ? repositories[repoIndex].title : title;
	const newUrl = !url ? repositories[repoIndex].url : url;
	const newTechs = !techs ? repositories[repoIndex].techs : techs;

	const updatedRepo = {
		id,
		title: newTitle,
		url: newUrl,
		techs: newTechs,
		likes,
	};

	repositories[repoIndex] = updatedRepo;

	return response.json(updatedRepo);
});

app.delete('/repositories/:id', (request, response) => {
	const { id } = request.params;
	const repoIndex = repositories.findIndex((repo) => repo.id === id);

	if (repoIndex < 0) {
		return response.status(400).json({ error: 'Repository not found' });
	}

	repositories.splice(repoIndex, 1);

	return response.status(204).send();
});

app.post('/repositories/:id/like', (request, response) => {
	const { id } = request.params;
	const repoIndex = repositories.findIndex((repo) => repo.id === id);

	if (repoIndex < 0) {
		return response.status(400).json({ error: 'Repository not found' });
	}

	repositories[repoIndex].likes++;

	return response.json(repositories[repoIndex]);
});

module.exports = app;
