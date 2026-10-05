const {
    User,
    Address,
} = require('../model');


// ========================================
// Find User By UUID
// ========================================

const findUserByUUID = async (user_uuid) => {

    const user = await User.findOne({
        where: {
            user_uuid,
        },

        attributes: [
            'user_id',
        ],
    });

    return user;
};


// ========================================
// Find Address By UUID
// ========================================

const findAddressByUUID = async (address_uuid, user_uuid = null) => {

    const where = {
        address_uuid,
    };

    if (user_uuid) {

        const user = await findUserByUUID(user_uuid);

        if (!user) {
            return null;
        }

        where.user_id = user.user_id;
    }

    const address = await Address.findOne({
        where,

        attributes: {
            exclude: [
                'address_id',
                'user_id',
            ],
        },
    });

    return address;
};


// ========================================
// Find Address By Internal ID
// ========================================

const findAddressById = async (address_id) => {

    const address = await Address.findByPk(address_id);

    return address;
};


// ========================================
// Find User Addresses
// ========================================

const findUserAddresses = async (user_uuid) => {

    const user = await findUserByUUID(user_uuid);

    if (!user) {
        return null;
    }

    const addresses = await Address.findAll({

        where: {
            user_id: user.user_id,
        },

        attributes: {
            exclude: [
                'address_id',
                'user_id',
            ],
        },

        order: [
            ['is_default', 'DESC'],
            ['createdAt', 'DESC'],
        ],
    });

    return addresses;
};


// ========================================
// Create Address
// ========================================

const createAddress = async (user_uuid, data) => {

    const user = await findUserByUUID(user_uuid);

    if (!user) {
        return null;
    }

    const {
        title,
        receiver_name,
        receiver_phone,
        province,
        city,
        address,
        postal_code,
        plaque,
        unit,
        is_default,
    } = data;

    const newAddress = await Address.create({

        user_id: user.user_id,

        title,
        receiver_name,
        receiver_phone,
        province,
        city,
        address,
        postal_code,
        plaque,
        unit,

        is_default: is_default === true,
    });

    return newAddress;
};


// ========================================
// Update Address
// ========================================

const updateAddress = async (address_uuid, user_uuid, data) => {

    const user = await findUserByUUID(user_uuid);

    if (!user) {
        return null;
    }

    const address = await Address.findOne({
        where: {
            address_uuid,
            user_id: user.user_id,
        },
    });

    if (!address) {
        return null;
    }

    await address.update({
        title: data.title,
        receiver_name: data.receiver_name,
        receiver_phone: data.receiver_phone,
        province: data.province,
        city: data.city,
        address: data.address,
        postal_code: data.postal_code,
        plaque: data.plaque,
        unit: data.unit,
    });

    return address;
};


// ========================================
// Delete Address
// ========================================

const deleteAddress = async (address_uuid, user_uuid) => {

    const address = await findAddressByUUID(
        address_uuid,
        user_uuid
    );

    if (!address) {
        return null;
    }

    await address.destroy();

    return true;
};


// ========================================
// Set Default Address
// ========================================

const setDefaultAddress = async (address_uuid, user_uuid) => {

    const user = await findUserByUUID(user_uuid);

    if (!user) {
        return null;
    }

    const address = await Address.findOne({
        where: {
            address_uuid,
            user_id: user.user_id,
        },
    });

    if (!address) {
        return null;
    }

    await Address.update(
        {
            is_default: false,
        },
        {
            where: {
                user_id: user.user_id,
                is_default: true,
            },
        }
    );

    await address.update({
        is_default: true,
    });

    return address;
};


module.exports = {

    findUserByUUID,

    findAddressByUUID,
    findAddressById,

    findUserAddresses,

    createAddress,
    updateAddress,
    deleteAddress,

    setDefaultAddress,
};