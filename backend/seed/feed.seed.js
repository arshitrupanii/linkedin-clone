import "dotenv/config";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";

import { connectDB } from "../lib/db.js";
import Post from "../models/post.model.js";
import User from "../models/user.model.js";

const demoPassword = "linkedin-demo-password";

const userSeeds = [
	{
		name: "Alex Johnson",
		username: "alex.johnson",
		email: "alex.johnson@example.com",
		headline: "Senior Product Designer at Northstar",
		location: "San Francisco, CA",
		about: "Product designer focused on making complex tools simple and useful.",
		profilePicture: "https://i.pravatar.cc/150?img=12",
		skills: ["Product Design", "Figma", "Design Systems"],
	},
	{
		name: "Maya Patel",
		username: "maya.patel",
		email: "maya.patel@example.com",
		headline: "Software Engineer building developer tools",
		location: "Austin, TX",
		about: "Full-stack engineer who enjoys building reliable developer experiences.",
		profilePicture: "https://i.pravatar.cc/150?img=47",
		skills: ["JavaScript", "Node.js", "MongoDB"],
	},
	{
		name: "Jordan Lee",
		username: "jordan.lee",
		email: "jordan.lee@example.com",
		headline: "People Operations Lead | Building great teams",
		location: "New York, NY",
		about: "Helping growing teams do their best work together.",
		profilePicture: "https://i.pravatar.cc/150?img=32",
		skills: ["Recruiting", "Leadership", "People Operations"],
	},
	{
		name: "Sam Rivera",
		username: "sam.rivera",
		email: "sam.rivera@example.com",
		headline: "Independent consultant and startup advisor",
		location: "Denver, CO",
		about: "I help early-stage teams turn good ideas into useful products.",
		profilePicture: "https://i.pravatar.cc/150?img=11",
		skills: ["Strategy", "Startups", "Product Management"],
	},
	{
		name: "Priya Shah",
		username: "priya.shah",
		email: "priya.shah@example.com",
		headline: "Marketing Manager helping products find their audience",
		location: "Seattle, WA",
		about: "I turn customer insights into clear stories and thoughtful campaigns.",
		profilePicture: "https://i.pravatar.cc/150?img=44",
		skills: ["Content Strategy", "Brand Marketing", "Analytics"],
	},
	{
		name: "Chris Morgan",
		username: "chris.morgan",
		email: "chris.morgan@example.com",
		headline: "Cloud Architect | Infrastructure and platform engineering",
		location: "Chicago, IL",
		about: "Building secure, scalable platforms for teams that move quickly.",
		profilePicture: "https://i.pravatar.cc/150?img=13",
		skills: ["AWS", "Kubernetes", "Platform Engineering"],
	},
	{
		name: "Elena Garcia",
		username: "elena.garcia",
		email: "elena.garcia@example.com",
		headline: "UX Researcher turning customer feedback into action",
		location: "Boston, MA",
		about: "Curious about people, products, and the moments where they meet.",
		profilePicture: "https://i.pravatar.cc/150?img=49",
		skills: ["User Research", "Usability Testing", "Interviewing"],
	},
	{
		name: "Noah Williams",
		username: "noah.williams",
		email: "noah.williams@example.com",
		headline: "Data Analyst | Making better decisions with data",
		location: "Portland, OR",
		about: "I enjoy finding the signal in the noise and making insights accessible.",
		profilePicture: "https://i.pravatar.cc/150?img=68",
		skills: ["SQL", "Python", "Data Visualization"],
	},
];

const postSeeds = [
	{
		author: "alex.johnson",
		content:
			"Just wrapped up a new design system with the team. The best part was seeing shared components reduce friction for both designers and engineers.",
		createdAt: new Date("2026-09-30T09:30:00.000Z"),
		likes: ["maya.patel", "jordan.lee"],
		comments: [
			{ user: "maya.patel", content: "Design systems make such a difference. Great work!" },
		],
	},
	{
		author: "maya.patel",
		content:
			"Small reminder: great documentation is a product feature. It saves time, builds confidence, and helps new teammates contribute sooner.",
		createdAt: new Date("2026-10-01T14:15:00.000Z"),
		likes: ["alex.johnson", "sam.rivera"],
		comments: [
			{ user: "sam.rivera", content: "Could not agree more. Clear docs are a competitive advantage." },
		],
	},
	{
		author: "jordan.lee",
		content:
			"We are hiring thoughtful people who enjoy solving ambiguous problems and collaborating across disciplines. Reach out if that sounds like you.",
		createdAt: new Date("2026-10-02T11:45:00.000Z"),
		likes: ["alex.johnson"],
		comments: [],
	},
	{
		author: "sam.rivera",
		content:
			"After a month of customer interviews, one lesson stands out: listen for the problem behind the feature request.",
		createdAt: new Date("2026-10-03T16:00:00.000Z"),
		likes: ["maya.patel", "jordan.lee"],
		comments: [
			{ user: "jordan.lee", content: "That question has saved us from building the wrong thing many times." },
		],
	},
	{
		author: "maya.patel",
		content:
			"Today I helped a teammate ship their first production change. Watching someone gain confidence is one of the most rewarding parts of engineering.",
		createdAt: new Date("2026-10-04T08:20:00.000Z"),
		likes: ["alex.johnson", "sam.rivera"],
		comments: [],
	},
	{
		author: "priya.shah",
		content:
			"Launching a campaign is exciting, but the best insights often arrive after launch. Make time to read the feedback, study the data, and share what you learned.",
		createdAt: new Date("2026-10-04T13:40:00.000Z"),
		likes: ["alex.johnson", "elena.garcia", "noah.williams"],
		comments: [
			{ user: "elena.garcia", content: "The learning loop is where the real value is." },
		],
	},
	{
		author: "chris.morgan",
		content:
			"Platform engineering is not just about tools. It is about giving product teams a safe path to move faster without having to reinvent the basics.",
		createdAt: new Date("2026-10-05T09:10:00.000Z"),
		likes: ["maya.patel", "sam.rivera", "noah.williams"],
		comments: [
			{ user: "maya.patel", content: "A paved road is so much better than every team solving the same problem alone." },
			{ user: "sam.rivera", content: "This is exactly the kind of leverage teams need as they scale." },
		],
	},
	{
		author: "elena.garcia",
		content:
			"Finished a week of usability interviews today. The most useful question was simple: 'What did you expect to happen next?'",
		createdAt: new Date("2026-10-05T15:25:00.000Z"),
		likes: ["alex.johnson", "jordan.lee", "priya.shah"],
		comments: [],
	},
	{
		author: "noah.williams",
		content:
			"A good dashboard should answer the next question, not just display the last one. Clear context makes data much easier to act on.",
		createdAt: new Date("2026-10-06T07:50:00.000Z"),
		likes: ["maya.patel", "chris.morgan"],
		comments: [
			{ user: "priya.shah", content: "Context is often the difference between a chart and an insight." },
		],
	},
	{
		author: "alex.johnson",
		content:
			"One of my favorite parts of working in a cross-functional team is seeing the same problem through different lenses. Better solutions usually come from that combination.",
		createdAt: new Date("2026-10-06T10:30:00.000Z"),
		likes: ["elena.garcia", "chris.morgan", "priya.shah"],
		comments: [
			{ user: "jordan.lee", content: "Different perspectives make the work stronger." },
		],
	},
];

const seedFeed = async () => {
	await connectDB();

	const password = await bcrypt.hash(demoPassword, 10);
	const users = new Map();

	for (const seed of userSeeds) {
		const user = await User.findOneAndUpdate(
			{ username: seed.username },
			{
				$set: {
					...seed,
					password,
				},
				$setOnInsert: {
					connections: [],
				},
			},
			{ new: true, upsert: true, setDefaultsOnInsert: true }
		);
		users.set(seed.username, user);
	}

	const userIds = userSeeds.map(({ username }) => users.get(username)._id);
	for (const userId of userIds) {
		await User.findByIdAndUpdate(userId, {
			$set: { connections: userIds.filter((connectionId) => !connectionId.equals(userId)) },
		});
	}

	for (const seed of postSeeds) {
		const author = users.get(seed.author);
		const likes = seed.likes.map((username) => users.get(username)._id);
		const comments = seed.comments.map((comment) => ({
			user: users.get(comment.user)._id,
			content: comment.content,
			createdAt: seed.createdAt,
		}));

		await Post.findOneAndUpdate(
			{ author: author._id, content: seed.content },
			{
				$setOnInsert: {
					author: author._id,
					content: seed.content,
					createdAt: seed.createdAt,
					updatedAt: seed.createdAt,
					likes,
					comments,
				},
			},
			{ upsert: true, setDefaultsOnInsert: true }
		);
	}

	console.log(`Seeded ${userSeeds.length} users and ${postSeeds.length} feed posts.`);
	console.log("Demo login: alex.johnson / linkedin-demo-password");
};

try {
	await seedFeed();
} catch (error) {
	console.error("Feed seed failed:", error);
	process.exitCode = 1;
} finally {
	await mongoose.disconnect();
}
