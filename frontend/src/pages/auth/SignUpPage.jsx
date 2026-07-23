import { Link } from "react-router-dom";
import SignUpForm from "../../components/auth/SignUpForm";

const SignUpPage = () => {
	return (
		<div className='min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8'>
			<div className='sm:mx-auto sm:w-full sm:max-w-md'>
				<img className='mx-auto h-36 w-auto' src='/logo.svg' alt='LinkedIn' />
				<h2 className='text-center text-3xl font-extrabold text-neutral'>
					Make the most of your professional life
				</h2>
			</div>
			<div className='mt-8 sm:mx-auto sm:w-full sm:max-w-md shadow-md'>
				<div className='bg-secondary py-8 px-4 shadow sm:rounded-lg sm:px-10'>
					<SignUpForm />

					<div className='mt-6'>
						<div className='relative'>
							<div className='absolute inset-0 flex items-center'>
								<div className='w-full border-t border-base-300'></div>
							</div>
							<div className='relative flex justify-center text-sm'>
								<span className='px-2 bg-secondary text-info'>Already on LinkedIn?</span>
							</div>
						</div>
						<div className='mt-6'>
							<Link
								to='/login'
								className='w-full flex justify-center py-2 px-4 border border-base-300 rounded-md shadow-sm text-sm font-medium text-primary bg-secondary hover:bg-base-200'
							>
								Sign in
							</Link>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
export default SignUpPage;
