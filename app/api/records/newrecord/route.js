import { NextResponse } from 'next/server';
import HealthRecord from '../../../models/records';
import User from '../../../models/user';
import { connectMongoDB } from "../../../libs/connectDb";
import { encrypt } from '@/app/libs/encryption';
import { uploadImage } from '@/app/libs/uploadImage';

export async function POST(req) {
    console.log("trying");
    connectMongoDB();
    try {
        const formData = await req.formData();
        
        const diagnosis = formData.get("diagnosis");
        const prescription = formData.get("prescription");
        const status = formData.get("status");
        const notes = formData.get("notes");
        const patientId = formData.get("patientId");
        const doctorId = formData.get("doctorId");
        const image = formData.get("image");
        const data = await uploadImage(image, 'records')
        console.log(image);
        console.log(data.url,data.public_id);
        
       
        if (!diagnosis || !prescription || !status || !notes || !patientId || !doctorId || !image) {
            throw new Error('One or more required fields are missing');
        }
        const encryptedDiagnosis = encrypt(diagnosis);
        const encryptedPrescription = encrypt(prescription);
        const encryptedStatus = encrypt(status);
        const encryptedNotes = encrypt(notes);

        const record = new HealthRecord({
            diagnosis: encryptedDiagnosis,
            prescription: encryptedPrescription,
            status: encryptedStatus,
            notes: encryptedNotes,
            patientId,
            doctorId,
            image: { image_url: data.url,public_id:data.public_id } // Assuming image.path contains the file path
        });

        await record.save();

        const user = await User.findById(patientId);
        if (user) {
            if (!user.records) {
                user.records = [];
            }
            user.records.push(record._id);
            await user.save();
        } else {
            console.error('User not found for ID:', patientId);
            throw new Error('User not found');
        }

        console.log("Record added:", record);
        return NextResponse.json({ message: "Record added successfully", success: true });
    } catch (error) {
        console.error("Error:", error);
        return NextResponse.error("Failed to add record", 500);
    }
}
