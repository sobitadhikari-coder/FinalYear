from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from app.authenticate.serializers.profile_serializers import ProfileSerializer

class ProfileView(APIView):
    permission_classes=[IsAuthenticated]

    def get(self, request):
        serializer = ProfileSerializer(request.user)
        return Response(serializer.data)

    def put(self, request):
        serializer = ProfileSerializer(
            request.user,
            data=request.data,
            partial=True
        )

        if serializer.is_valid():
            serializer.save()
            return Response({
                "message": "Profile updated",
                "data": serializer.data
            })

        return Response(serializer.errors, status=400)
    
class ProfileImageUploadView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request):
        image = request.FILES.get('profile_image')

        if not image:
            return Response(
                {"error": "No image provided"},
                status=status.HTTP_400_BAD_REQUEST
            )

        request.user.profile_image = image
        request.user.save()

        return Response({
            "message": "Profile image uploaded successfully",
            "image_url": request.user.profile_image.url
        })