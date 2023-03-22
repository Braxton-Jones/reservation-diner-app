import { useState, useEffect } from 'react';
import './sass/_app.scss';
import toast, { Toaster } from 'react-hot-toast';

function App() {
	const [reservations, setReservations] = useState([]);
	const [currentReservation, setCurrentReservation] = useState([]);
	useEffect(() => {
		const fetchReservations = async () => {
			const response = await fetch(
				'https://reservation-api-ujvu.onrender.com/',
			);
			const json = await response.json();
			setReservations(json);
		};

		fetchReservations();

		const intervalId = setInterval(() => {
			fetchReservations();
		}, 5000);

		return () => {
			clearInterval(intervalId);
		};
	}, []);

	function handleReseravationClick(id) {
		reservations.map((reservation) => {
			if (id === reservation._id) {
				setCurrentReservation(reservation);
			}
		});
	}

	const handleCheckIn = async (id) => {
		const response = await fetch(
			`http://localhost:4000/api/reservations/${id}`,
			{
				method: `DELETE`,
			},
		);
		toast('Reseravtion Checked in!');
		setCurrentReservation('');
	};

	return (
		<>
			<main>
				<Toaster />
				<section className='reservation-list-container'>
					<div className='list'>
						{reservations.map(({ name, email, date, people, _id }) => {
							const formattedDateTime = `${new Date(
								date,
							).toLocaleDateString()} / ${new Date(date).toLocaleTimeString()}`;
							return (
								<div
									key={_id}
									onClick={() => {
										handleReseravationClick(_id);
									}}
									className='reservation'
								>
									<h2 className='name'>
										Reservation for {name} @ {formattedDateTime}
									</h2>
									<p className='email'>{email}</p>
									<p className='size'>Party Size: {people}</p>
								</div>
							);
						})}
					</div>
				</section>
				<section className='reservation-content-container'>
					<div className='content'>
						<h2 className='content-name'>
							{currentReservation && (
								<>
									Reservation for {currentReservation.name} at{' '}
									{currentReservation.date
										? new Date(currentReservation.date).toLocaleDateString()
										: ''}{' '}
									for{' '}
									{currentReservation.date
										? new Date(currentReservation.date).toLocaleTimeString()
										: ''}
								</>
							)}
						</h2>

						<p className='content-email'>Email: {currentReservation.email}</p>
						<p className='content-size'>
							Party Size: {currentReservation.people}
						</p>
						<button
							className='check-in-btn'
							onClick={() => handleCheckIn(currentReservation._id)}
						>
							Check In
						</button>
					</div>
				</section>
			</main>
			<section className='isMobile'>
				<div>
					<p>
						This App was designed for Desktop and Tablet. Please access this app
						on those devices
					</p>
				</div>
			</section>
		</>
	);
}

export default App;
