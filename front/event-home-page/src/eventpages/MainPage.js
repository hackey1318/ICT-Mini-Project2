import React, { useState, useEffect, useCallback } from "react";
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css';
import './../eventCss/MainPageStyle.css';
import moment from 'moment';
import axios from 'axios';
import EventModal from './EventModal';
import styled from 'styled-components';
import { Link } from "react-router-dom";
import myIcon from '../img/user.png';
import NotificationSystem from "../js/notification/notificationInfo";
import likeIcon from '../img/heart.png';
import BannerInfo from "../pages/banner/bannerInfo";
import apiNoAccessClient from "../js/axiosConfigNoAccess";

function MainPage() {
    const StyledLink = styled(Link)`
        text-decoration: none;
        &:link, &:visited, &:active {
            color: black;
        }
        &:hover {
            color: cyan;
        }
    `;

    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isLoggedIn, setIsLoggedIn] = useState(!!sessionStorage.getItem('accessToken'));
    const [imageData, setImageData] = useState([]);
    const [filteredImageData, setFilteredImageData] = useState([]);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [calendarKey, setCalendarKey] = useState(Date.now());
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(9);
    const [totalPages, setTotalPages] = useState(1);

    const debounce = (func, delay) => {
        let timeout;
        return function (...args) {
            const context = this;
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(context, args), delay);
        };
    };

    const debouncedSetSearchTerm = useCallback(debounce(setDebouncedSearchTerm, 500), []);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await apiNoAccessClient.get('/api/events/ongoing');
                setImageData(response.data);
            } catch (error) {
                console.error('Error fetching events:', error);
            }
        };
        fetchEvents();
    }, []);

    useEffect(() => {
        setIsLoggedIn(!!sessionStorage.getItem('accessToken'));
    }, []);

    useEffect(() => {
        const fetchFilteredEvents = async () => {
            try {
                let apiUrl = `/api/events/search?`;
                apiUrl += `nowPage=${currentPage}&onePageRecord=${itemsPerPage}&`;

                if (debouncedSearchTerm) {
                    apiUrl += `searchTerm=${debouncedSearchTerm}&`;
                }
                if (currentDate) {
                    apiUrl += `selectedDate=${moment(currentDate).format('YYYY-MM-DDTHH:mm:ss')}&`;
                }

                apiUrl = apiUrl.replace(/&$/, '');

                const response = await apiNoAccessClient.get(apiUrl);

                setFilteredImageData(response.data.content);
                setTotalPages(response.data.paging.totalPage);

            } catch (error) {
                console.error('Error fetching filtered events:', error);
                setFilteredImageData([]);
            }
        };

        fetchFilteredEvents();
    }, [debouncedSearchTerm, currentDate, currentPage, itemsPerPage]);

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        debouncedSetSearchTerm(e.target.value);
    };

    const setCurrenDate2 = (date) => {
        setCurrentDate(date);
        setCurrentPage(1);
    };

    const DatePicker = ({ currentDate, setCurrenDate2 }) => {
        const [date, setDate] = useState(currentDate);

        useEffect(() => {
            setDate(currentDate);
        }, [currentDate]);

        const onDateChange = (date) => {
            setDate(date);
            setCurrenDate2(date);
        };

        return (
            <Calendar
                key={calendarKey}
                onChange={onDateChange}
                value={date}
                locale="ko-KR"
                calendarType="hebrew"
                formatShortWeekday={(locale, date) =>
                    ["일", "월", "화", "수", "목", "금", "토"][date.getDay()]
                }
                formatDay={(locale, date) => `${date.getDate()}`}
                showNeighboringMonth={false}
                className="custom-calendar"
                tileClassName={({ date }) => {
                    const day = date.getDay();
                    if (day === 0) return "sunday";
                    if (day === 6) return "saturday";
                    if (day === 5) return "friday";
                    return "";
                }}
            />
        );
    };

    const openModal = (event) => {
        setSelectedEvent(event);
    };

    const closeModal = () => {
        setSelectedEvent(null);
    };

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className="main-page">

            <header className="main-header">
                <BannerInfo />
                <div className="header-menu">
                    <ul>
                        {isLoggedIn ? (
                            <>
                                <NotificationSystem />
                            </>
                        ) : null}
                    </ul>
                </div>
            </header>

            <div className="search-bar">
                <input
                    type="text"
                    placeholder="검색어를 입력해주세요"
                    value={searchTerm}
                    onChange={handleSearchChange}
                />
            </div>

            <div className="content-area">
                <div className="date-picker-container">
                    <DatePicker
                        currentDate={currentDate}
                        setCurrenDate2={setCurrenDate2}
                    />
                </div>

                <div className="image-grid">
                    {filteredImageData.length > 0 ? (
                        filteredImageData.map((image) => (
                            <div key={image.no} className="image-item">
                                <h5 className="title-name">{image.title}</h5>
                                <img
                                    src={image.img_list && image.img_list[0] ? image.img_list[0].originImgurl : null}
                                    alt={image.title}
                                    className="grid-image"
                                />
                                <p className="date-addr">{moment(image.startDate).format('YYYY-MM-DD')} ~ {moment(image.endDate).format('YYYY-MM-DD')}</p>
                                <p className="date-addr">행사장소: {image.addr}</p>
                                <button className="viewButton" onClick={() => openModal(image)}>자세히 보기</button>
                            </div>
                        ))
                    ) : (
                        <div>입력한 검색어와 연관된 검색어가 없습니다.</div>
                    )}
                </div>
            </div>
            {totalPages > 1 && (
                <div className="pagination-event">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
                        <button key={number} onClick={() => paginate(number)} className={currentPage === number ? 'active' : ''}>
                            {number}
                        </button>
                    ))}
                </div>
            )}
            {selectedEvent && (
                <EventModal event={selectedEvent} onClose={closeModal} />
            )}
        </div>
    );
}

export default MainPage;