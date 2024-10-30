package phanngonhatlam.buoi7;

import java.util.Scanner;

public class Buoi7{
   public static int nhapSoNguyen(){
    Scanner sc = new Scanner(System.in);
    int n = 0;
    while (true) {
        try{
            System.out.println("\nHay nhap gia tri: ");
            n = Integer.parseInt(sc.nextLine());
            break;
        }catch(Exception ex){
            //TODO: handle exception
            System.out.println("Du lieu khong hop le, hay nhap lai !!");
        }
    }
    return n;
   }
   //Nhập điểm và kiểm soát dữ liệu đầu vào
   public static float nhapDiem()
   {
    float diem = 0;
    Scanner sc = new Scanner(System.in);
    while(true){
        try{
            System.out.println("\nNhap diem:");
            diem = Float.parseFloat(sc.nextLine());
            if (diem >= 0 && <=10)
                break;
            else
            {
                System.out.println("Diem khop hop le, gia tri nam trong khoang 0-10");
            }
        } catch(Exception ex){
            //TODO: handle exception
            System.out.println("Du lieu khong hop le, gia tri nam trong khoang 0-10 hay nhap lai !!");
        }
    }
    return diem;
   }
   //demo codee vidu9
   public static void hienThiMangBaChieu()
   {
    int arr3[][][]= {{{1,2,3},{4,5,6},{7}},{{5,6,7},{8,9}}};
    System.out.println("Danh sach phan tu cua mang arr3 la: ");
    for(int i=0; i<arr3.length;i++)
    {
        for (int j=0;j<arr3[i].length; j++)
        {for (int k=0;k<arr3[i][j].length;k++)
        {
            System.out.printf("arr3[%d][%d][%d]=%d\t",i,j,k,arr3[i][j][k]);
        }
        System.out.println();
    }
   }  
}
    public static void main(String[] args) {
    /*   int tam = nhapSoNguyen();
        System.out.printf("Danh sach cac phan tu nho hon hoac bang %d la: ", tam);
        float diem = nhapDiem();
        System.out.printf("So diem vua nhap %f la: ",diem);*/
        hienThiMangBaChieu();

    }
}
   
