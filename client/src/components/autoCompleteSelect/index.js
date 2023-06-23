import React, { useState } from 'react';

const FilterableSelectBox = ({ options, selectedCustomer, setSelectedCustomer, selectedPhoneNumber, setSelectedPhoneNumber, selectedAddress, setSelectedAddress, filterValue, setFilterValue }) => {



    const handleFilterChange = event => {
        setFilterValue(event.target.value);
    };

    const handleOptionClick = option => {
        console.log('clicked on customer :', option)
        setSelectedCustomer(option.fullName);
        setFilterValue(option.fullName)

        // selects the first contact number
        setSelectedPhoneNumber(option.phoneNumber[0][Object.keys(option.phoneNumber[0])[0]])
        setSelectedAddress(option.address[0][Object.keys(option.address[0])[0]])
    };


    return (
        <div style={{ padding: '20px' }}>
            <div>Selected Customer: {selectedCustomer}</div>
            <div>Selected phoneNumber: {selectedPhoneNumber}</div>
            <div>Selected address: {selectedAddress}</div>
            <input
                type="text"
                value={filterValue}
                onChange={handleFilterChange}
                placeholder="Filter options"
            />
            <button onClick={() => {
                setSelectedCustomer('')
                setFilterValue('')

                setSelectedPhoneNumber('')
                setSelectedAddress('')
            }}>Clear</button>
            <div>
                {/* {filterValue !== '' &&
                    options
                        .filter(option => option.fullName.toLowerCase().includes(filterValue.toLowerCase()))
                        .map((option, index) => (
                            <div key={index} onClick={() => handleOptionClick(option)}>
                                {option}
                            </div>
                        ))} */}

                <table style={{ width: "100%" }}>
                    <thead>
                        <tr>
                            <td>Name </td>
                            {/* <td >Phone Number </td> */}
                            <td style={{ display: selectedCustomer ? "" : "none", whiteSpace: 'nowrap' }}>Phone Number </td>
                            <td style={{ display: selectedPhoneNumber ? "" : "none", }}>Address</td>
                            {/* <td >Address</td> */}
                        </tr>
                    </thead>
                    <tbody>
                        {options.filter(option => option.fullName.toLowerCase().includes(filterValue.toLowerCase()))
                            .map((customer, index) => <tr key={index}
                                style={{ border: '1px solid black', cursor: 'pointer' }}
                            >
                                <td
                                    style={{ padding: '20px' }}
                                    onClick={(e) => handleOptionClick(customer)}
                                >{customer.fullName}</td>
                                <td style={{ display: selectedCustomer ? "" : "none" }}

                                >
                                    {
                                        customer.phoneNumber.map((number, index) => {
                                            for (let key in number) {
                                                return <div key={index}
                                                    style={{
                                                        border: (selectedPhoneNumber === number[key]) ? '3px solid red' : '',
                                                        borderRadius: (selectedPhoneNumber === number[key]) ? '16px' : '',
                                                        padding: '10px'
                                                    }}
                                                    onClick={() => {
                                                        setSelectedPhoneNumber(customer.phoneNumber[index][key])

                                                    }}
                                                >{`${key}:`}<br /> {`${customer.phoneNumber[index][key]}`}</div>
                                            }
                                        })
                                    }
                                </td>
                                <td style={{ display: selectedPhoneNumber ? "" : "none", }}>
                                    {
                                        customer.address.map((ad, index) => {
                                            for (let key in ad) {
                                                return <div key={index}
                                                    style={{
                                                        border: (selectedAddress === ad[key]) ? '3px solid red' : '',
                                                        borderRadius: (selectedAddress === ad[key]) ? '16px' : '',
                                                        padding: '10px'
                                                    }}
                                                    onClick={() => {
                                                        setSelectedAddress(customer.address[index][key])

                                                    }}
                                                >{`${key}:`}<br /> {`${customer.address[index][key]}`}</div>
                                            }
                                        })
                                    }
                                </td>
                            </tr>)}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default FilterableSelectBox;
