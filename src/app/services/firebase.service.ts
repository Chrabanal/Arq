import { inject, Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile, getAuth } from 'firebase/auth';
import { User } from '../models/user.model';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { getFirestore, setDoc, doc , getDoc,addDoc, collection,query, collectionData ,updateDoc ,deleteDoc} from '@angular/fire/firestore';
import { UtilsService } from './utils.service';
import {AngularFireStorage} from '@angular/fire/compat/storage';
import { getStorage, uploadString,ref,getDownloadURL ,deleteObject } from '@angular/fire/storage';



@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

    auth = inject(AngularFireAuth);
    firestore = inject(AngularFirestore);
    utilsSvc= inject(UtilsService);
    storage = inject(AngularFireStorage);

getAuth(){
  return getAuth();
}


signIn(user : User){
  return signInWithEmailAndPassword(getAuth(), user.email, user.password);
}




signUp(user : User){
  return createUserWithEmailAndPassword(getAuth(), user.email, user.password);
}




updateUser(displayName: string){
  return updateProfile(getAuth().currentUser ,{displayName});


}





// base de datos firestore



setDocument(path: string , data: any){

  return setDoc(doc(getFirestore(), path), data);
}


//====actualizar documento===
updateDocument(path: string , data: any){

  return updateDoc(doc(getFirestore(), path), data);
}


//====eliminar documento===

deleteDocument(path: string ){
  return deleteDoc(doc(getFirestore(), path));
}







async getDocument(path: string){
  return (await getDoc(doc(getFirestore(), path))).data();

}


//====agregar documento==
addDocument(path: string, data: any){

  return addDoc(collection(getFirestore(), path), data);
}

deleteFile(path:string){
return deleteObject(ref(getStorage(), path));
}



//=======almacenar usuario en local storage===

async uploadImage(path: string, data_url: string){
  return uploadString(ref(getStorage(), path), data_url, 'data_url').then(()  => {
    return getDownloadURL(ref(getStorage(), path));
  });
}

async getFilePath(url: string){
  return ref(getStorage(), url).fullPath

}











//====cerrar sesion===
signOut(){
  return getAuth().signOut();
  localStorage.removeItem('user');
  this.utilsSvc.routerLink('/auth');
}


//====obtener documentos(fotos productos) actual===

getCollectionsData(path : string , collectionQuery? : any){
 const ref = collection(getFirestore(), path);
  return collectionData(query(ref, collectionQuery), {idField: 'id'});
}




}