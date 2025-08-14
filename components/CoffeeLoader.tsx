'use client';
import React, { useEffect, useState } from 'react';

interface CoffeeLoadingScreenProps {
	autoFade?: boolean;
	minDurationMs?: number;
	message?: string;
}

const CoffeeLoadingScreen: React.FC<CoffeeLoadingScreenProps> = ({ autoFade = true, minDurationMs = 600, message = 'Warming up coffee machine...' }) => {
	const [visible, setVisible] = useState(true);
	const [canHide, setCanHide] = useState(false);

	useEffect(() => {
		if (!autoFade) return;
		const start = Date.now();
		const handleReady = () => {
			const elapsed = Date.now() - start;
			const wait = Math.max(0, minDurationMs - elapsed);
			setTimeout(() => setCanHide(true), wait);
		};
		if (document.readyState === 'complete') {
			handleReady();
		} else {
			window.addEventListener('load', handleReady, { once: true });
		}
		return () => {
			window.removeEventListener('load', handleReady);
		};
	}, [autoFade, minDurationMs]);

	useEffect(() => {
		if (canHide) {
			const t = setTimeout(() => setVisible(false), 350); // match fade duration
			return () => clearTimeout(t);
		}
	}, [canHide]);

	if (!visible) return null;

	return (
		<div className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/90 text-white transition-opacity duration-300 ${canHide ? 'opacity-0' : 'opacity-100'}`}>
			<div className='relative w-40 h-40 mb-8'>
				<div className='absolute inset-0 rounded-full bg-gradient-to-tr from-amber-600/30 via-amber-400/20 to-transparent animate-pulse blur-xl' />
				<div className='absolute inset-0 flex items-center justify-center'>
					{/* <Image
						src='/coffee.png'
						alt='Loading coffee'
						width={128}
						height={128}
						className='animate-[spin_12s_linear_infinite] opacity-90'
						priority
					/> */}
				</div>
			</div>
			<div className='flex flex-col items-center gap-2'>
				<p className='text-sm tracking-wide uppercase text-white/70'>{message}</p>
				<div className='h-1 w-48 overflow-hidden rounded-full bg-white/10'>
					<div className='h-full w-1/3 animate-[progress_1.8s_ease-in-out_infinite] rounded-full bg-gradient-to-r from-amber-400 via-amber-200 to-amber-500' />
				</div>
			</div>
			<style jsx global>{`
				@keyframes progress {
					0% { transform: translateX(-120%); }
					50% { transform: translateX(60%); }
					100% { transform: translateX(120%); }
				}
			`}</style>
		</div>
	);
};

export default CoffeeLoadingScreen;
